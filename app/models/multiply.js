const multiply = (x, y) => x * y;

if (typeof module !== 'undefined' && Object.prototype.hasOwnProperty.call(module, 'exports')) {
  module.exports = multiply;
}
