const fetch = require('node-fetch');
const KBaseServiceClient = require('../lib/index.js').KBaseServiceClient;
var expect = require('chai').expect;

describe('KBase Service Client test', () => {
    beforeEach(() => {
        global.fetch = fetch;
    });

    it ('should do simple, non-authed lookups', (done) => {
        let wizardClient = new KBaseServiceClient('ServiceWizard', 'https://ci.kbase.us/services/service_wizard', null);
        wizardClient.call('get_service_status', [{'module_name': 'NarrativeService', 'version': null}])
            .then((result) => {
                console.log(result);
                expect(result.url).to.contain('https://ci.kbase.us');
                expect(result.url).to.contain('NarrativeService');
                done();
            })
            .catch((err) => {
                console.log(err);
                done(new Error('Got an error from the client function.'));
            });
    });


});
