export class NarrativeConfig {
    urls : {[key: string]: string} = {
        'workspace': 'https://ci.kbase.us/services/ws',
        'auth': 'https://ci.kbase.us/services/auth'
    };

    get(key: string) : string {
        return 'value for ' + key;
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
