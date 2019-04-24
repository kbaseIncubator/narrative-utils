const expect = require('chai').expect;
const Icon = require('../lib/icon.js');

describe('Icon tests', () => {
    it('getIconInfo should return icon info for a registered type', () => {
        let t = 'Genome';
        let info = Icon.getIconInfo(t);
        expect(info.className).to.equal('icon icon-genome');
        expect(info.color).to.equal('#3F51B5');
    });

    it('getIconInfo should return default icon info for an unknown type', () => {
        let t = 'Some Type';
        let info = Icon.getIconInfo(t);
        expect(info.className).to.equal('fa-file-o');
        expect(info.color).to.equal('#03A9F4');
    });
});
