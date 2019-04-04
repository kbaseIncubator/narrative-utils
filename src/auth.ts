import {
    NarrativeConfig
} from './config';

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
}
