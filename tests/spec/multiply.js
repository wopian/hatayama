const multiplyLib = require('../fixtures/multiply');

describe("#multiply", function() {
    it('returns the correct multiplied value', function() {
        var product = multiplyLib.multiply(2, 3);
        expect(product).toBe(6);
    });
});