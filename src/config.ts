/**
 * The main config object for the various Narrative packages.
 */
export class NarrativeConfig {
    /**
     * @private
     * @todo update to fetch from a config file.
     * The set of urls as key-value-pairs.
     */
    urls : {[key: string]: string} = {
        'workspace': 'https://ci.kbase.us/services/ws',
        'auth': 'https://ci.kbase.us/services/auth',
        'service_wizard': 'https://ci.kbase.us/services/service_wizard',
        'narrative_method_store': 'https://ci.kbase.us/services/narrative_method_store/rpc'
    };

    /**
     * @private
     * @todo update to get from a config file.
     */
    keys : {[key: string]: string} = {
        'cookieName': 'kbase_session'
    };

    /**
     * Return the configured value for some key.
     * @param key {string} the config key to look up.
     */
    get(key: string) : string {
        if (key in this.keys) {
            return this.keys[key];
        }
        else {
            return null;
        }
    }

    /**
     * Return the configured value for some service.
     * @param key {string}
     */
    url(key: string) : string {
        if (key in this.urls) {
            return this.urls[key];
        }
        else {
            return null;
        }
    }
};
