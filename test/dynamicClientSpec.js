const fetch = require('node-fetch');
global.fetch = fetch;
const KBaseDynamicServiceClient = require('../lib/index.js').KBaseDynamicServiceClient;
var expect = require('chai').expect;

describe('KBase Dynamic Service Client test', () => {
    const service = 'NarrativeTestDynamic';

    it ('Should make a simple non-authenticated call', (done) => {
        let client = new KBaseDynamicServiceClient({
            module: service,
            version: 'dev'
        });
        client.call('sample_dyn_service_call', [{input: 'foo'}])
            .then((result) => {
                expect(result.output).to.equal('foo');
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the dynamic service client!'));
            });
    });

    it ('Should fail reasonably when given bad parameters', (done) => {
        let client = new KBaseDynamicServiceClient({
            module: service,
            version: 'dev',
        });
        client.call('sample_dyn_service_call', [{foo: 'bar'}])
            .then(() => {
                done(new Error('This should throw an error!'));
            })
            .catch((err) => {
                expect(err.message).to.equal('Internal Server Error');
                expect(err.code).to.equal(500);
                expect(err.data).to.deep.contain({
                    message: '\'Key "input" not found in parameters.\'',
                    code: -32000,
                    name: 'Server error'
                });
                done();
            });
    });

    it ('Should fail when a service exists but a method does not', (done) => {
        let client = new KBaseDynamicServiceClient({
            module: service,
            version: 'dev'
        });
        client.call('not_real', [{no: 'way'}])
            .then(() => {
                done(new Error('This should throw an error!'));
            })
            .catch((err) => {
                expect(err.name).to.equal('JsonRpcError');
                expect(err.code).to.equal(500);
                expect(err.data).to.deep.contain({
                    code: -32601,
                    name: 'Method not found'
                });
                done();
            });
    });

    it ('Should fail when a service does not exist', (done) => {
        let client = new KBaseDynamicServiceClient({
            module: 'NotAService',
            version: 'dev'
        });
        client.call('not_real', [])
            .then(() => {
                done(new Error('This should throw an error!'));
            })
            .catch((err) => {
                expect(err.name).to.equal('JsonRpcError');
                expect(err.code).to.equal(500);
                expect(err.data).to.deep.contain({
                    code: -32000,
                    message: 'u"\'Module cannot be found based on module_name or git_url parameters.\'"',
                    name: 'Server error'
                });
                done();
            });
    });

    it ('Should handle auth tokens well', (done) => {
        let client = new KBaseDynamicServiceClient({
            module: service,
            authToken: 'foo'
        });
        client.call('sample_dyn_service_call', [{input: 'wat'}])
            .then((result) => {
                expect(result.output).to.equal('wat');
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the dynamic service client!'));
            });
    })
});
