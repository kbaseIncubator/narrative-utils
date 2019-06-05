import {
    NarrativeConfig
} from './config';

export interface AuthErrorInfo {
    code: number,
    message: string,
    data?: any
}

export class AuthError extends Error implements AuthErrorInfo {
    /**
     * The HTTP error code (likely 500, because that's the JSON-RPC stack we have).
     */
    code: number;
    /**
     * The primary message from the service.
     */
    message: string;
    /**
     * An optional data stack provided by the service with more error details. Typically
     * contains a server-side stacktrace, error code, and detailed message.
     */
    data?: any;
    constructor(errorInfo: AuthErrorInfo) {
        super(errorInfo.message);
        Object.setPrototypeOf(this, AuthError.prototype);
        this.name = 'AuthError';

        this.code = errorInfo.code;
        this.message = errorInfo.message;
        this.data = errorInfo.data;
        this.stack = (<any>new Error()).stack;
    }
}

export interface AuthRequestParams {
    operation: string,
    method: string,
    version?: string
}

/**
 * Handles the token-based KBase authentication stuff. An Auth token is fetched from
 * the browser's "kbase_session" cookie (by default - see NarrativeConfig), stored in this object,
 * and provided on request.
 */
export class Auth {
    config: NarrativeConfig;

    /**
     * The user's auth token.
     */
    token: string = null;

    /**
     * @public
     * @constructor
     * Gets the main config and uses the configured cookie name to get the auth token.
     * If no auth token is loaded, then it remains null;
     */
    constructor() {
        this.config = new NarrativeConfig();
        this.token = this._getTokenFromCookie();
    }

    /**
     * @private
     * Fetches the auth token from the configured cookie.
     */
    _getTokenFromCookie(): string {
        let name = this.config.get('cookieName');
        const values = '; ' + document.cookie;
        // a little cleverness from
        // https://gist.github.com/joduplessis/7b3b4340353760e945f972a69e855d11
        let parts = values.split('; ' + name + '=');
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        else {
            return null;
        }
    }

    /* does a GET request to fetch a token's introspection.
     * Returns a json doc with these keys:
     * expires - millis since epoch
     * created - millis since epoch
     * name - if the token has a name
     * id - a UUID for that token
     * type - Login, etc.
     * user - KBase user id
     * cachefor - millis
     */
    getTokenInfo(token?: string) {
        return this.makeAuthCall(token ? token : this._getTokenFromCookie(), {
            operation: '/token',
            method: 'GET'
        });
    }

    /**
     * returns a Promise that makes the API call.
     * the call that gets made looks like:
     * Configured URL + '/api/' + version + '/' + method
     * the "method" string should contain all url encoded
     * parameters as expected.
     */
    makeAuthCall(token: string, callParams: AuthRequestParams) : Promise<any> {
        let version = callParams.version || 'V2';
        let call_url : RequestInfo = [
                this.config.urls.auth,
                '/api/',
                version,
                callParams.operation
            ].join('');

        let callHeaders : HeadersInit = {
            Accept: 'application/json',
            Authorization: token
        };

        let request : RequestInit = {
            method: callParams.method,
            headers: callHeaders,
            mode: 'cors'
        };

        return fetch(call_url, request)
            .then(this.handleFetchErrors)
            .then(response => response.json());
    }

    handleFetchErrors(response: any) {
        if (response.ok) {
            return response;
        }
        return response.text()
            .then((errText: string) => {
                let detail: any = {};
                try {
                    detail = JSON.parse(errText);
                    console.log(detail);
                    if ('error' in detail) {
                        detail = detail['error'];
                    }
                }
                catch {
                    detail['message'] = errText;
                }
                let info: AuthErrorInfo = {
                    code: response.status,
                    message: response.statusText,
                    data: detail
                };
                throw new AuthError(info);
            });
    }
}
