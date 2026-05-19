import { expect } from '@esm-bundle/chai';
import init from '../../blocks/card/card.js';

const originalHref = window.location.href;

function makeCard(innerHtml, ...extraClasses) {
  const el = document.createElement('div');
  el.classList.add('card', ...extraClasses);
  el.innerHTML = innerHtml;
  return el;
}

const WITH_PICTURE = `
  <div>
    <p><picture><img src="card.jpg"></picture></p>
    <div>
      <p>Body text</p>
      <p><a href="/learn-more">Learn more</a></p>
    </div>
  </div>
`;

const WITHOUT_PICTURE = `
  <div>
    <div>
      <p>Body text</p>
      <p><a href="/learn-more">Learn more</a></p>
    </div>
  </div>
`;

const WITHOUT_CTA_LINK = `
  <div>
    <div>
      <p>Body text</p>
      <p>No link here</p>
    </div>
  </div>
`;

const WITHOUT_CONTENT_DIV = `
  <div>
    <p>Only a paragraph, no inner div</p>
  </div>
`;

describe('card block', () => {
  afterEach(() => {
    window.history.pushState({}, '', originalHref);
  });

  it('adds card-inner to the first direct div child', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector(':scope > div').classList.contains('card-inner')).to.be.true;
  });

  it('wraps a picture-in-p into a card-picture-container div', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-picture-container picture')).to.not.be.null;
  });

  it('places card-picture-container as the first child of card-inner', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-inner').firstElementChild.classList.contains('card-picture-container')).to.be.true;
  });

  it('removes the original picture paragraph from card-inner', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-inner > p > picture')).to.be.null;
  });

  it('adds card-content-container to the inner content div', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-content-container')).to.not.be.null;
  });

  it('adds card-cta-container to the last paragraph with a link', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-cta-container')).to.not.be.null;
  });

  it('moves the CTA paragraph to the last position inside card-inner', () => {
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-inner').lastElementChild.classList.contains('card-cta-container')).to.be.true;
  });

  it('appends window.location.hash to the CTA href when the hash-aware class is set', () => {
    window.history.pushState({}, '', '#section-one');
    const el = makeCard(WITH_PICTURE, 'hash-aware');
    init(el);
    expect(el.querySelector('.card-cta-container a').getAttribute('href')).to.equal('/learn-more#section-one');
  });

  it('does not append the hash when the hash-aware class is absent', () => {
    window.history.pushState({}, '', '#section-one');
    const el = makeCard(WITH_PICTURE);
    init(el);
    expect(el.querySelector('.card-cta-container a').getAttribute('href')).to.equal('/learn-more');
  });

  it('does not throw and still adds card-inner when there is no picture', () => {
    const el = makeCard(WITHOUT_PICTURE);
    expect(() => init(el)).to.not.throw();
    expect(el.querySelector('.card-inner')).to.not.be.null;
  });

  it('skips card-picture-container when there is no picture', () => {
    const el = makeCard(WITHOUT_PICTURE);
    init(el);
    expect(el.querySelector('.card-picture-container')).to.be.null;
  });

  it('still applies card-content-container and card-cta-container without a picture', () => {
    const el = makeCard(WITHOUT_PICTURE);
    init(el);
    expect(el.querySelector('.card-content-container')).to.not.be.null;
    expect(el.querySelector('.card-cta-container')).to.not.be.null;
  });

  it('does not throw and skips card-cta-container when the last paragraph has no link', () => {
    const el = makeCard(WITHOUT_CTA_LINK);
    expect(() => init(el)).to.not.throw();
    expect(el.querySelector('.card-cta-container')).to.be.null;
  });

  it('does not throw when there is no inner content div', () => {
    const el = makeCard(WITHOUT_CONTENT_DIV);
    expect(() => init(el)).to.not.throw();
    expect(el.querySelector('.card-inner')).to.not.be.null;
  });
});
