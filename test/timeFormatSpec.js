'use strict';
var expect = require('chai').expect;
var TF = require('../lib/timeFormat');

const testISOTime = '2015-12-09T21:58:22.202Z';
const testISOTime2 = '2016-01-06T00:48:43.196Z';
const testOutputString = 'Wed Dec 09 2015';
const reformattedString = '2015-12-09 13:58:22';
const testExactDayStr = 'Dec 9, 2015';

describe('TimeFormat tests', () => {
    it('getTimeStampStr should properly output an exact time string', () => {
        let d = TF.getTimeStampStr(testISOTime, true);
        expect(d).to.equal(testExactDayStr);
    });

    it('getTimeStampStr should return a fuzzy relative time string', () => {
        var prevDay = new Date();
        prevDay.setDate(prevDay.getDate()-2);
        var d = TF.getTimeStampStr(prevDay, false);
        expect(d).to.equal('2 days ago');
    });

    it('getTimeStampStr should return a fuzzy relative time string @ 2 days 2 hours', () => {
        var prevDay = new Date();
        prevDay.setDate(prevDay.getDate()-2);
        prevDay.setHours(prevDay.getHours()-2);
        var d = TF.getTimeStampStr(prevDay, false);
        expect(d).to.equal('2 days ago');
    });

    it('getTimeStampStr should return a fuzzy relative time string @ 1 day', () => {
        var prevDay = new Date();
        prevDay.setDate(prevDay.getDate()-1);
        var d = TF.getTimeStampStr(prevDay, false);
        expect(d).to.equal('a day ago');
    });

    it('getTimeStampStr should return a fuzzy relative time string @ 1 hour', () => {
        var prevDay = new Date();
        prevDay.setHours(prevDay.getHours()-1);
        var d = TF.getTimeStampStr(prevDay, false);
        expect(d).to.equal('an hour ago');
    });

    it('getTimeStampStr should return a fuzzy relative time string @ 1 minute', () => {
        var prevDay = new Date();
        prevDay.setMinutes(prevDay.getMinutes()-1);
        var d = TF.getTimeStampStr(prevDay, false);
        expect(d).to.equal('a minute ago');
    });

    it('getTimeStampStr should return an exact date for over a year ago', () => {
        let d = TF.getTimeStampStr(testISOTime, false);
        expect(d).to.equal(testExactDayStr);
    });

    it('getTimeStampStr should return null for an invalid time stamp', () => {
        expect(TF.getTimeStampStr('foo')).to.equal(null);
    });

});
