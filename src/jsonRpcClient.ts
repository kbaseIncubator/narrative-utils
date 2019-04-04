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
export interface JsonRpcParam {
    [key: string]: any
}

// The entire JSON RPC request object
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

export class KBaseJsonRpcError extends Error implements JsonRpcErrorInfo {
    code: number;
    message: string;
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
