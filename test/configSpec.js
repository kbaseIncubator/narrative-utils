'use strict';
var expect = require('chai').expect;
var NarrativeConfig = require('../lib/index.js').NarrativeConfig;
describe('Config test', () => {
    it('should return a workspace url', () => {
        let cfg = new NarrativeConfig();
        expect(cfg.url('workspace')).to.contain('services/ws');
    });
    it('should return null for missing keys', () => {
        let cfg = new NarrativeConfig();
        expect(cfg.url('not_real_endpoint')).to.be.null;
    });
});
