const multiplyLib = require('../fixtures/multiply');

describe('#multiply', () => {
  it('returns the correct multiplied value', () => {
    const product = multiplyLib.multiply(2, 3);
    expect(product).toBe(6);
  });
});
