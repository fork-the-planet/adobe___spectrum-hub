import { expect } from '@esm-bundle/chai';
import init from '../../templates/home/home.js';

function makeHomeDOM() {
  document.body.innerHTML = `
    <div>
      <h1>Welcome</h1>
    </div>
    <div class="block-content">
      <p>Intro content</p>
    </div>
  `;
}

describe('home template', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds heading-size-xxxxl class to the h1', () => {
    makeHomeDOM();
    init();
    expect(document.querySelector('h1').classList.contains('heading-size-xxxxl')).to.be.true;
  });

  it('sets home-column class on the h1 parent div', () => {
    makeHomeDOM();
    init();
    expect(document.querySelector('.home-column')).to.not.be.null;
  });

  it('home-column div contains the h1', () => {
    makeHomeDOM();
    init();
    expect(document.querySelector('.home-column h1')).to.not.be.null;
  });

  it('moves the home-column div inside its next sibling', () => {
    makeHomeDOM();
    init();
    expect(document.querySelector('.block-content .home-column')).to.not.be.null;
  });

  it('h1 ends up nested inside the next sibling section', () => {
    makeHomeDOM();
    init();
    expect(document.querySelector('.block-content h1')).to.not.be.null;
  });

  it('does not throw when the expected DOM structure is present', () => {
    makeHomeDOM();
    expect(() => init()).to.not.throw();
  });
});
