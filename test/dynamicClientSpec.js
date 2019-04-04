const fetch = require('node-fetch');
global.fetch = fetch;
const KBaseDynamicServiceClient = require('../lib/index.js').KBaseDynamicServiceClient;
var expect = require('chai').expect;

describe('KBase Dynamic Service Client test', () => {
    const service = 'NarrativeTestDynamic';

    it ('should make a simple non-authenticated call', (done) => {
        let client = new KBaseDynamicServiceClient(service, 'dev', null);
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

    // it ('should fail reasonably when given bad parameters', (done) => {
    //     let wizardClient = new KBaseServiceClient('ServiceWizard', servUrl, null);
    //     wizardClient.call('get_service_status', [{'module_name': 'NarrativeService'}])
    //         .then(() => {
    //             done(new Error('Should have failed!'));
    //         })
    //         .catch((err) => {
    //             expect(err.message).to.equal('Internal Server Error');
    //             expect(err.code).to.equal(500)
    //             expect(err.data).to.deep.contain({
    //                 message: 'version',
    //                 code: -32000,
    //                 name: 'Server error'
    //             })
    //             done();
    //         });
    // });
});
