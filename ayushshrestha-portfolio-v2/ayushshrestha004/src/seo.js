// One place that decides the <title>, description, canonical, social tags and
// structured data for every URL. Used at build time (prerender) and in the browser.
import { posts, getPost } from './blog/posts';

export const SITE = {
  url: 'https://ayushshrestha004.com.np',
  name: 'Ayush Shrestha',
  ogImage: 'https://ayushshrestha004.com.np/og-image.png',
};

const HOME = {
  title: 'Ayush Shrestha | DevOps Engineer & Full-Stack Developer, Nepal',
  description:
    'Ayush Shrestha is a DevOps engineer and full-stack developer from Kathmandu, Nepal. See his CI/CD, Docker and cloud projects, skills and contact details.',
  ogDescription:
    'DevOps engineer and full-stack developer from Kathmandu, Nepal. CI/CD, Docker, cloud and full-stack projects.',
};

export const BASE_GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: 'Ayush Shrestha',
      description: 'Portfolio of Ayush Shrestha, DevOps engineer and full-stack developer from Kathmandu, Nepal.',
      inLanguage: 'en',
      publisher: { '@id': `${SITE.url}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE.url}/#profilepage`,
      url: `${SITE.url}/`,
      name: 'Ayush Shrestha | DevOps Engineer & Full-Stack Developer',
      isPartOf: { '@id': `${SITE.url}/#website` },
      mainEntity: { '@id': `${SITE.url}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: 'Ayush Shrestha',
      url: `${SITE.url}/`,
      image: `${SITE.url}/ayush-shrestha.jpg`,
      jobTitle: 'DevOps Engineer & Full-Stack Developer',
      description:
        'DevOps engineer and full-stack developer from Kathmandu, Nepal, building CI/CD pipelines, containerised infrastructure and full-stack web applications.',
      address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
      knowsAbout: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Linux', 'Networking', 'React', 'Node.js', 'PostgreSQL'],
      sameAs: [
        'https://www.linkedin.com/in/ayush-shrestha-18b8b621a/',
        'https://github.com/IsthatAyus',
      ],
    },
  ],
};

export const normalize = (pathname = '/') => {
  const p = pathname.split('?')[0].split('#')[0];
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p || '/';
};

export function metaFor(pathname) {
  const path = normalize(pathname);

  if (path === '/') {
    return {
      title: HOME.title,
      description: HOME.description,
      ogDescription: HOME.ogDescription,
      canonical: `${SITE.url}/`,
      type: 'website',
      image: SITE.ogImage,
      noindex: false,
      pageJsonLd: null,
    };
  }

  if (path === '/blog') {
    return {
      title: 'Blog | Ayush Shrestha',
      description:
        'Articles and project write-ups by Ayush Shrestha, DevOps engineer and full-stack developer from Nepal.',
      canonical: `${SITE.url}/blog/`,
      type: 'website',
      image: SITE.ogImage,
      noindex: posts.length === 0, // an empty blog page should not be indexed
      pageJsonLd: null,
    };
  }

  const m = path.match(/^\/blog\/([^/]+)$/);
  const post = m && getPost(m[1]);
  if (post) {
    const url = `${SITE.url}/blog/${post.slug}/`;
    const image = post.image ? `${SITE.url}${post.image}` : SITE.ogImage;
    return {
      title: `${post.title} | Ayush Shrestha`,
      description: post.description,
      canonical: url,
      type: 'article',
      image,
      noindex: post.draft,
      pageJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        datePublished: post.date,
        dateModified: post.updated || post.date,
        image: [image],
        keywords: post.tags.join(', '),
        inLanguage: 'en',
        author: { '@id': `${SITE.url}/#person` },
        publisher: { '@id': `${SITE.url}/#person` },
      },
    };
  }

  return {
    title: 'Page not found | Ayush Shrestha',
    description: 'This page does not exist.',
    canonical: `${SITE.url}${path}/`,
    type: 'website',
    image: SITE.ogImage,
    noindex: true,
    notFound: true,
    pageJsonLd: null,
  };
}

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const jsonScript = (obj, id) =>
  `<script type="application/ld+json"${id ? ` id="${id}"` : ''}>${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Static HTML for the <head> SEO block (used by scripts/prerender.mjs).
export function headBlock(meta) {
  const ogDesc = meta.ogDescription || meta.description;
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="author" content="Ayush Shrestha" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<meta name="theme-color" content="#060b14" />`,
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
    `<meta property="og:site_name" content="Ayush Shrestha" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(ogDesc)}" />`,
    `<meta property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta property="og:image" content="${esc(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(ogDesc)}" />`,
    `<meta name="twitter:image" content="${esc(meta.image)}" />`,
    jsonScript(BASE_GRAPH),
    meta.pageJsonLd ? jsonScript(meta.pageJsonLd, 'page-jsonld') : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}
