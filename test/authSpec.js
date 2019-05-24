'use strict';

var expect = require('chai').expect;
const Auth = require('../lib/index.js').Auth;
const jsdom = require('jsdom');
var auth_token = 'WBXXXPHELLPKNGYR3REE6K6SWKELE3CV'
var auth_user_id = 'tgu2'

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

    it('should fail when given bad token', (done) => {
        let auth = new Auth();
        expect(auth.token).to.be.null;
        auth.getTokenInfo("fake_auth_token-1098")
            .then(() => {
                done(new Error('This should throw an error!'));
            })
            .catch((err) => {
                expect(err.code).to.equal(401);
                expect(err.name).to.equal("AuthError");
                expect(err.data).to.deep.contain({
                    message: '10020 Invalid token',
                    httpstatus: 'Unauthorized',
                    httpcode: 401
                    });
                done();
            });
    });

    it('should get token info when given token', (done) => {
        let auth = new Auth();
        expect(auth.token).to.be.null;
        auth.getTokenInfo(auth_token)
            .then(result => {
                expect(result).to.have.property('type');
                expect(result).to.have.property('id');
                expect(result).to.have.property('expires');
                expect(result).to.have.property('created');
                expect(result).to.have.property('user');
                expect(result).to.have.property('name');
                expect(result).to.have.property('cachefor');
                expect(result.user).to.equal(auth_user_id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the auth server'));
            });
    });

    it('should get token info when given cookie', (done) => {
        document.cookie = 'kbase_session=' + auth_token;
        let auth = new Auth();
        auth.getTokenInfo()
            .then(result => {
                expect(result).to.have.property('type');
                expect(result).to.have.property('id');
                expect(result).to.have.property('expires');
                expect(result).to.have.property('created');
                expect(result).to.have.property('user');
                expect(result).to.have.property('name');
                expect(result).to.have.property('cachefor');
                expect(result.user).to.equal(auth_user_id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the auth server'));
            });
        expect(auth.token).to.equal(auth_token);
    });
});
