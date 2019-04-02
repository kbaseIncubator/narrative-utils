import {
    NarrativeConfig
} from './config';

export class Auth {
    config: NarrativeConfig;
    token: string;

    constructor() {
        this.config = new NarrativeConfig();
        this.token = this._getTokenFromCookie();
    }

    _getTokenFromCookie(): string {
        let name = this.config.get('cookieName');
        const values = '; ' + document.cookie;
        // a little cleverness from
        // https://gist.github.com/joduplessis/7b3b4340353760e945f972a69e855d11
        let parts = values.split('; ' + name + '=');
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        else {
            return null;
        }
    }
}
