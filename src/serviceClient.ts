import {
    KBaseJsonRpcClient
} from './jsonRpcClient';

export interface IKBaseServiceClientOptions {
    module: string;
    url: string;
    authToken?: string;
}

/**
 * A generic client for communicating with KBase services.
 * This is useful for running commands against the core services like Workspace, Groups, Narrative Job Service, etc.
 * For dynamic services, see the KBaseDynamicServiceClient.
 * @see KBaseDynamicServiceClient
 */
export class KBaseServiceClient extends KBaseJsonRpcClient {
    readonly module: string;
    authToken: string = null;
    url: string;

    /**
     * @constructor
     */
    constructor(options: IKBaseServiceClientOptions) {
        super();
        this.module = options.module;
        if (options.authToken) {
            this.authToken = options.authToken;
        }
        this.url = options.url;
    }

    /**
     * Make a call to the service this client is attached to.
     * @param method the method to call from the given module
     * @param params the array of parameters to pass to the method. Note that this should be wrapped as an array.
     * @returns a Promise that should resolve into the expected results of the call. Any errors get thrown as a KBaseJsonRpcError.
     * @see KBaseJsonRpcError
     */
    call(method: string, params: Array<any>, timeout?: number): Promise<any> {
        return this.request({
            url: this.url,
            module: this.module,
            func: method,
            params: params,
            timeout: timeout ? timeout : 30000,
            authorization: this.authToken
        })
        .then((response) => {
            if (response.result && response.result.length) {
                return response.result[0];
            }
            else {
                return null;
            }
    });
    }
}
