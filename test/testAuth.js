'use strict';

var expect = require('chai').expect;
const Auth = require('../lib/index.js').Auth;
const jsdom = require('jsdom');

describe('Auth test', () => {
    beforeEach(() => {
        const { JSDOM } = jsdom;
        let window = (new JSDOM(``, { runScripts: 'outside-only' })).window;
        global.document = window.document;
    });

    it('should get a null token if no cookie present', () => {
        let auth = new Auth();
        expect(auth.token).to.be.null;
    });

    it('should get a token if there is a cookie present', () => {
        document.cookie = 'kbase_session=foo';
        let auth = new Auth();
        expect(auth.token).to.equal('foo');
    });
});
