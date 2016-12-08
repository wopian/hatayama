/* jslint node: true */
/* global describe, it, expect */

"use strict";

var fs       = require('fs');

describe("DOM Checks", function() {

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
        loadFixtures('DOM.html');
    });

    it('checks if an element is in DOM', function() {
        expect($('div')).toBeInDOM();
    });

    it('checks if an ID is in DOM', function() {
        expect($('#test')).toBeInDOM();
    });

    it('checks if a class is in DOM', function() {
        expect($('.test')).toBeInDOM();
    });
});