import * as Promise from 'bluebird';
import {
    KBaseJsonRpcClient
} from './jsonRpcClient';

import {
    NarrativeConfig
} from './config';

class Cache {
    serviceWizardUrl: string;
    serviceWizardClient: KBaseJsonRpcClient;

    constructor() {
        let cfg: NarrativeConfig = new NarrativeConfig();
        this.serviceWizardUrl = cfg.url('service_wizard');
        this.serviceWizardClient = new KBaseJsonRpcClient();
    }

    getCachedUrl(module: string, authToken: string, version?: string): Promise<any> {

        return this.serviceWizardClient.request({
            url: this.serviceWizardUrl,
            module: 'ServiceWizard',
            func: 'get_service_status',
            params: [{
                module_name: module,
                version: version
            }],
            rpcContext: null,
            timeout: 30,
            authorization: authToken
        });

    }
}

export class DynamicServiceClient {
    readonly module: string;
    cache: Cache;
    authToken: string;
    constructor(module: string, authToken: string) {
        this.module = module;
        this.authToken = authToken;
        this.cache = new Cache();
    }

    callFunc(method: string, params: Array<any>): Promise<any> {
        return this.cache.getCachedUrl(this.module, this.authToken);
    }
}
