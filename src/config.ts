import iconData from './assets/icons.json';

export interface IIconConfigData {
    methods: {
        method: Array<string>,
        app: Array<string>
    },
    data: {[key: string]: Array<string>},
    colors: Array<string>,
    colorMapping: {[key: string]: string}
}

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
    keys : {[key: string]: any} = {
        cookieName: 'kbase_session',
        icons: <IIconConfigData>iconData
    };

    /**
     * Return the configured value for some key.
     * @param key {string} the config key to look up.
     * @param backup {string} (optional) if the key isn't present, and a backup is given,
     * just return the backup.
     */
    get(key: string, backup: string = null) : any {
        if (key in this.keys) {
            return this.keys[key];
        }
        else {
            return backup;
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
