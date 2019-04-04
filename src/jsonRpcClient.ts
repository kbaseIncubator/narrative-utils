/**
 * Intended for internal use. For making KBase JSON-RPC requests, use either the KBaseServiceClient or KBaseDynamicServiceClient.
 */
export interface KBaseJsonRpcRequestOptions {
    url: string,
    module: string,
    func: string,
    params: Array<any>,
    rpcContext?: any,
    timeout: number,
    authorization: string
}

// The JSON RPC Request parameters
// An array of  JSON objects
/**
 * Intended for internal use. For making KBase JSON-RPC requests, use either the KBaseServiceClient or KBaseDynamicServiceClient.
 */
export interface JsonRpcParam {
    [key: string]: any
}

// The entire JSON RPC request object
/**
 * Intended for internal use. For making KBase JSON-RPC requests, use either the KBaseServiceClient or KBaseDynamicServiceClient.
 */
export interface KBaseJsonRpcRequest {
    method: string,
    version: '1.1',
    id: string,
    params: Array<JsonRpcParam>,
    context?: any
}

export interface JsonRpcErrorInfo {
    code: number,
    message: string,
    data?: any
}

/**
 * A possible result of any KBase service call, core or dynamic.
 */
export class KBaseJsonRpcError extends Error implements JsonRpcErrorInfo {
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
    constructor(errorInfo: JsonRpcErrorInfo) {
        super(errorInfo.message);
        Object.setPrototypeOf(this, KBaseJsonRpcError.prototype);
        this.name = 'JsonRpcError';

        this.code = errorInfo.code;
        this.message = errorInfo.message;
        this.data = errorInfo.data;
        this.stack = (<any>new Error()).stack;
    }
}

/**
 * Intended for internal use. For making KBase JSON-RPC requests, use either the KBaseServiceClient or KBaseDynamicServiceClient.
 */
export class KBaseJsonRpcClient {
    constructor() {
    }

    request(options: KBaseJsonRpcRequestOptions) : Promise<any> {
        let rpcData : KBaseJsonRpcRequest = {
            version: '1.1',
            method: options.module + '.' + options.func,
            id: String(Math.random()).slice(2),
            params: options.params,
        };
        if (options.rpcContext) {
            rpcData.context = options.rpcContext;
        }
        let request : RequestInit = {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-type': 'application/json',
                'Authorization': options.authorization
            },
            redirect: 'follow',
            referrer: 'no-referrer',
            body: JSON.stringify(rpcData)
        };
        return fetch(options.url, request)
            .then(this.handleFetchErrors)
            .then(response => response.json())
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
                    if ('error' in detail) {
                        detail = detail['error'];
                    }
                }
                catch {
                    detail['message'] = errText;
                }
                let info: JsonRpcErrorInfo = {
                    code: response.status,
                    message: response.statusText,
                    data: detail
                };
                throw new KBaseJsonRpcError(info);
            });
    }
}
