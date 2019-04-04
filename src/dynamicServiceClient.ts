import {
    KBaseServiceClient
} from './serviceClient';
import {
    TimedMap
} from './timedMap';
import {
    NarrativeConfig
} from './config';

/**
 * A simple cache for dynamic service URLs. Whenever `getCachedUrl` is run, the cache is checked for the
 * URL for that module. If it's not expired, then it gets returned. If it is expired, then the service
 * wizard is queried for the dynamic service URL, then it gets cached, and finally returned.
 */
class ServiceUrlCache {
    serviceWizardUrl: string;
    serviceWizardClient: KBaseServiceClient;
    cacheMap: TimedMap;

    /**
     * The cache time should be > 0, otherwise, this is kinda pointless.
     * This automatically fetches the service wizard url from the config.
     * @param cacheTime How long to cache the url in ms.
     */
    constructor(cacheTime: number) {
        if (cacheTime < 0) {
            cacheTime = 0;
        }
        let cfg: NarrativeConfig = new NarrativeConfig();
        this.serviceWizardUrl = cfg.url('service_wizard');
        this.serviceWizardClient = new KBaseServiceClient({
            module: 'ServiceWizard',
            url: this.serviceWizardUrl
        });
        this.cacheMap = new TimedMap(cacheTime);
    }

    /**
     * Fetch the URL for a dynamic service. If version isn't provided, it gets
     * set to null, and we let the service wizard just return the latest one.
     * @todo add logic for handling multiple versions
     * @param module registered name of the module to look up.
     * @param version one of "dev", "beta", "prod" or a git hash
     */
    getCachedUrl(module: string, version?: string): Promise<any> {
        let mapped = this.cacheMap.get(module);
        if (mapped !== null) {
            return new Promise((resolve) => resolve(mapped));
        }
        else {
            if (!version) {
                version = null;
            }
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
};

export interface IKBaseDynamicServiceClientOptions {
    module: string,
    version?: string,
    authToken?: string
};

/**
 * A client for talking to KBase dynamic services. This handles fetching the dynamic URL
 * and making the call like the other service client.
 * @see KBaseServiceClient
 */
export class KBaseDynamicServiceClient extends KBaseServiceClient {
    cache: ServiceUrlCache;
    serviceVersion: string = null;

    /**
     * @constructor
     */
    constructor(options: IKBaseDynamicServiceClientOptions) {
        super({
            module: options.module,
            url: null,
            authToken: options.authToken
        })
        this.cache = new ServiceUrlCache(300000);
        if(options.version) {
            this.serviceVersion = options.version;
        }
    }

    /**
     * Call a method in a dynamic service.
     * @param method the method to call for the module this client is registered with
     * @param params the parameters to pass to the module
     * @returns a Promise that results in the response from the service Any errors get thrown as a KBaseJsonRpcError. Note that
     * errors can occur while fetching the service's URL from the service wizard.
     * @see KBaseJsonRpcError
     */
    call(method: string, params: Array<any>): Promise<any> {
        return this.cache.getCachedUrl(this.module, this.serviceVersion)
            .then((url) => {
                this.url = url;
                return super.call(method, params);
            });
    }
}
