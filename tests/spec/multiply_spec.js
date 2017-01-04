const Multiply = require('../../app/models/multiply.js');

describe('#multiply', () => {
  it('is defined', () => {
    expect(Multiply).toBeDefined();
  });

  it('returns the correct multiplied value', () => {
    const product = Multiply(2, 3);
    expect(product).toBe(6);
  });
});
