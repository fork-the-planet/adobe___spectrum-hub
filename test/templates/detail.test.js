import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../templates/detail/detail.js';
import { setConfig } from '../../scripts/ak.js';

describe('detail template', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Stub log so loadBlock failures (e.g. missing page-nav block) are swallowed silently.
    // components must be an array — loadBlock calls components.some().
    setConfig({ log: sandbox.stub(), components: [], linkBlocks: [], hostnames: [] });
    document.body.innerHTML = '<main><div><p>Page content</p></div></main>';
  });

  afterEach(() => {
    sandbox.restore();
    document.body.innerHTML = '';
  });

  it('creates a div.template-wrapper in the DOM', async () => {
    await init();
    expect(document.querySelector('.template-wrapper')).to.not.be.null;
  });

  it('template-wrapper replaces main at the top level', async () => {
    await init();
    expect(document.body.firstElementChild.classList.contains('template-wrapper')).to.be.true;
  });

  it('places nav.sitenav as the first child of template-wrapper', async () => {
    await init();
    const wrapper = document.querySelector('.template-wrapper');
    const firstChildElement = wrapper.firstElementChild;
    expect(firstChildElement.tagName.toLowerCase()).to.equal('nav');
    expect(firstChildElement.classList.contains('sitenav')).to.be.true;
  });

  it('adds aria-label "Second-level site navigation" to the sitenav', async () => {
    await init();
    const sitenav = document.querySelector('nav.sitenav');
    expect(sitenav.getAttribute('aria-label')).to.equal('Second-level site navigation');
  });

  it('places main as the second child of template-wrapper', async () => {
    await init();
    const wrapper = document.querySelector('.template-wrapper');
    const secondChildElement = wrapper.children[1];
    expect(secondChildElement.tagName.toLowerCase()).to.equal('main');
  });

  it('preserves the original main element (not a copy)', async () => {
    const original = document.querySelector('main');
    await init();
    expect(document.querySelector('.template-wrapper main')).to.equal(original);
  });

  it('preserves content inside main', async () => {
    await init();
    expect(document.querySelector('main p')).to.not.be.null;
  });

  it('places nav.page-nav as the last child of template-wrapper', async () => {
    await init();
    const wrapper = document.querySelector('.template-wrapper');
    const lastChild = wrapper.lastElementChild;
    expect(lastChild.tagName.toLowerCase()).to.equal('nav');
    expect(lastChild.classList.contains('page-nav')).to.be.true;
  });

  it('adds aria-label "On this page" to the page-nav', async () => {
    await init();
    const pageNav = document.querySelector('nav.page-nav');
    expect(pageNav.getAttribute('aria-label')).to.equal('On this page');
  });
});
