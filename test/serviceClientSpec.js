const fetch = require('node-fetch');
global.fetch = fetch;
const KBaseServiceClient = require('../lib/index.js').KBaseServiceClient;
var expect = require('chai').expect;

describe('KBase Service Client test', () => {
    const servUrl = 'https://ci.kbase.us/services/service_wizard';

    it ('Should do simple, non-authed lookups', (done) => {
        let wizardClient = new KBaseServiceClient('ServiceWizard', servUrl, null);
        wizardClient.call('get_service_status', [{'module_name': 'NarrativeService', 'version': null}])
            .then((result) => {
                expect(result.url).to.contain('https://ci.kbase.us');
                expect(result.url).to.contain('NarrativeService');
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the client function.'));
            });
    });

    it ('Should fail reasonably when given bad parameters', (done) => {
        let wizardClient = new KBaseServiceClient('ServiceWizard', servUrl, null);
        wizardClient.call('get_service_status', [{'module_name': 'NarrativeService'}])
            .then(() => {
                done(new Error('Should have failed!'));
            })
            .catch((err) => {
                expect(err.message).to.equal('Internal Server Error');
                expect(err.code).to.equal(500);
                expect(err.data).to.deep.contain({
                    message: 'version',
                    code: -32000,
                    name: 'Server error'
                });
                done();
            });
    });
});
