import { useEffect } from 'react';

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}
const meta = (attr, key) => () => {
  const el = document.createElement('meta');
  el.setAttribute(attr, key);
  return el;
};

// Keeps <head> correct when the visitor navigates between pages without a reload.
export function useSeo(m) {
  useEffect(() => {
    const ogDesc = m.ogDescription || m.description;
    document.title = m.title;
    const set = (attr, key, value) =>
      upsert(`meta[${attr}="${key}"]`, meta(attr, key)).setAttribute('content', value);

    set('name', 'description', m.description);
    set('name', 'robots', m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    set('property', 'og:type', m.type);
    set('property', 'og:title', m.title);
    set('property', 'og:description', ogDesc);
    set('property', 'og:url', m.canonical);
    set('property', 'og:image', m.image);
    set('name', 'twitter:title', m.title);
    set('name', 'twitter:description', ogDesc);
    set('name', 'twitter:image', m.image);

    upsert('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    }).setAttribute('href', m.canonical);

    const old = document.getElementById('page-jsonld');
    if (m.pageJsonLd) {
      const el = old || Object.assign(document.createElement('script'), { id: 'page-jsonld', type: 'application/ld+json' });
      el.textContent = JSON.stringify(m.pageJsonLd);
      if (!old) document.head.appendChild(el);
    } else if (old) {
      old.remove();
    }
  }, [m.title, m.description, m.canonical, m.type, m.image, m.noindex, m.ogDescription, m.pageJsonLd]);
}
