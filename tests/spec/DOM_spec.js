describe('Basic DOM Checks', () => {
  beforeEach(() => {
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

  it('will change header text', () => {
    const $title = $('title');
    expect($title.text()).toBe('Test');
  });
});
