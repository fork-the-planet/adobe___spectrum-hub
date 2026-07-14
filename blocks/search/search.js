import '../../deps/se/se.js';

const APP_ID = '464UXSQJQC';
const SEARCH_KEY = '271461afa0e340546d112204c7520c1e'; // public search-only key
const INDEX_NAME = 'spectrum-docs-test';
const DEBOUNCE_MS = 250;

async function search(query) {
  const resp = await fetch(
    `https://${APP_ID}-dsn.algolia.net/1/indexes/${encodeURIComponent(INDEX_NAME)}/query`,
    {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': APP_ID,
        'X-Algolia-API-Key': SEARCH_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    },
  );
  if (!resp.ok) {
    return [];
  }
  const { hits } = await resp.json();
  return hits;
}

function buildResult(hit) {
  const li = document.createElement('li');
  const link = document.createElement('a');
  link.href = hit.url;
  link.textContent = hit.title || hit.objectID;
  if (hit.external) {
    link.target = '_blank';
    link.rel = 'noopener';
  }
  li.append(link);
  if (hit.description) {
    const desc = document.createElement('p');
    desc.textContent = hit.description;
    li.append(desc);
  }
  return li;
}

export default function init(el) {
  const form = document.createElement('form');
  form.className = 'search-form';

  const input = document.createElement('se-input');
  input.type = 'search';
  input.id = 'search-input';
  input.name = 'query';
  input.setAttribute('placeholder', 'Search documents...');
  input.setAttribute('label', 'Search');

  const results = document.createElement('ul');
  results.className = 'search-results';
  results.setAttribute('aria-live', 'polite');

  const runSearch = async () => {
    const query = input.value.trim();
    if (!query) {
      results.replaceChildren();
      return;
    }
    const hits = await search(query);
    results.replaceChildren(...hits.map(buildResult));
  };

  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(runSearch, DEBOUNCE_MS);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(timeout);
    runSearch();
  });

  form.append(input);
  el.append(form, results);
}
