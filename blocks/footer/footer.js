import { getConfig, getMetadata } from '../../scripts/ak.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_PATH = '/fragments/nav/footer';

/**
 * loads and decorates the footer
 * @param {Element} el The footer element
 */
export default async function init(el) {
  el.classList.add('footer');
  const { locale } = getConfig();
  const footerMeta = getMetadata('footer');
  const path = footerMeta || FOOTER_PATH;

  const { fragment } = await loadFragment(`${locale.prefix}${path}`);
  if (!fragment) { return; }
  fragment.classList.add('footer__content');

  const sections = [...fragment.querySelectorAll('.section')];

  const copyright = sections.pop();
  copyright.classList.add('footer__copyright');

  const legal = sections.pop();
  legal.classList.add('footer__legal');

  el.append(fragment);
}
