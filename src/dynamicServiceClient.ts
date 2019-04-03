import {
    KBaseServiceClient
} from './serviceClient';
import {
    TimedMap
} from './timedMap';
import {
    NarrativeConfig
} from './config';

class Cache {
    serviceWizardUrl: string;
    serviceWizardClient: KBaseServiceClient;
    cacheMap: TimedMap;

    constructor(cacheTime: number) {
        let cfg: NarrativeConfig = new NarrativeConfig();
        this.serviceWizardUrl = cfg.url('service_wizard');
        this.serviceWizardClient = new KBaseServiceClient('service_wizard', this.serviceWizardUrl, null);
        this.cacheMap = new TimedMap(cacheTime);
    }

    getCachedUrl(module: string, authToken: string, version?: string): Promise<any> {
        let mapped = this.cacheMap.get(module);
        if (mapped !== null) {
            return new Promise((resolve) => resolve(mapped));
        }
        else {
            return this.serviceWizardClient.call('get_service_status', [{
                module_name: module,
                version: version
            }])
            .then((result) => {
                let url = result.url;
                this.cacheMap.put(module, url);
                return url;
            });
        }
    }
}

export class KBaseDynamicServiceClient extends KBaseServiceClient {
    cache: Cache;
    constructor(module: string, authToken: string) {
        super(module, null, authToken);
        this.cache = new Cache(300000);
    }

    call(method: string, params: Array<any>): Promise<any> {
        return this.cache.getCachedUrl(this.module, this.authToken)
            .then((url) => {
                this.url = url;
                return super.call(method, params);
            });
    }
}
