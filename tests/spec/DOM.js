// const fs       = require('fs');

describe('DOM Checks', () => {
  beforeEach(() => {
    jasmine.getFixtures().fixturesPath = 'base/tests/fixtures';
    loadFixtures('DOM.html');
  });

  it('checks if an element is in DOM', () => {
    expect($('div')).toBeInDOM();
  });

  it('checks if an ID is in DOM', () => {
    expect($('#test')).toBeInDOM();
  });

  it('checks if a class is in DOM', () => {
    expect($('.test')).toBeInDOM();
  });
});
