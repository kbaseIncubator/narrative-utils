'use strict';
var expect = require('chai').expect;
var TimedMap = require('../lib/index.js').TimedMap;
describe('Timed map test', () => {
    it('should return null with a 0 timeout', () => {
        let map = new TimedMap(0);
        map.put('foo', 'bar');
        expect(map.get('foo')).to.be.null;
    });

    it('should return as expected with a reasonable timeout', () => {
        let map = new TimedMap(1000);
        map.put('foo', 'bar');
        expect(map.get('foo')).to.equal('bar');
    });

    it('should handle objects as well', () => {
        let map = new TimedMap(1000);
        map.put('foo', {'bar': 'baz'});
        expect(map.get('foo')).to.deep.equal({'bar': 'baz'});
    });

    it('should timeout as expected', (done) => {
        let timeout = 10;
        let map = new TimedMap(timeout);
        map.put('foo', 'bar');
        setTimeout(() => {
            expect(map.get('foo')).to.be.null;
            done();
        }, timeout);
    });
});
