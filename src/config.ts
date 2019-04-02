export class NarrativeConfig {
    urls : {[key: string]: string} = {
        'workspace': 'https://ci.kbase.us/services/ws',
        'auth': 'https://ci.kbase.us/services/auth',
        'service_wizard': 'https://ci.kbase.us/services/service_wizard'
    };

    keys : {[key: string]: string} = {
        'cookieName': 'kbase_session'
    };

    get(key: string) : string {
        if (key in this.keys) {
            return this.keys[key];
        }
        else {
            return null;
        }
    }

    url(key: string) : string {
        if (key in this.urls) {
            return this.urls[key];
        }
        else {
            return null;
        }
    }
};
