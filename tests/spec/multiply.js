/* jslint node: true */
/* global describe, it, expect */

"use strict";

var multiply_lib = require('../fixtures/multiply');

describe("#multiply", function() {
    it('returns the correct multiplied value', function() {
        var product = multiply_lib.multiply(2, 3);
        expect(product).toBe(6);
    });
});