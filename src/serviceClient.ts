import {
    KBaseJsonRpcClient
} from './jsonRpcClient';

export class KBaseServiceClient extends KBaseJsonRpcClient {
    readonly module: string;
    authToken: string;
    url: string;

    constructor(module: string, url: string, authToken: string) {
        super();
        this.module = module;
        this.authToken = authToken;
        this.url = url;
    }

    /**
     *
     * @param method the method to call from the given module
     * @param params the array of parameters to pass to the method
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
            return response.result[0];
        });
    }
}
