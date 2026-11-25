// Loads every Markdown file in src/content/posts/ at build time.
// Add a file there and it becomes a page at /blog/<slug>/ — nothing else to wire up.
import { Marked } from 'marked';

const files = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const stripTags = (s = '') => s.replace(/<[^>]*>/g, '');

const slugifyHeading = (s) =>
  stripTags(s)
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const md = new Marked({ gfm: true });
md.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugifyHeading(inner)}">${inner}</h${depth}>\n`;
    },
    image({ href, title, text }) {
      const t = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${t} loading="lazy" decoding="async" />`;
    },
  },
});

function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`[blog] ${file}: missing front matter block (--- ... ---) at the top of the file`);
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i === -1) throw new Error(`[blog] ${file}: cannot read front matter line "${line}"`);
    const key = line.slice(0, i).trim();
    let value = line.slice(i + 1).trim();
    if (key === 'tags') {
      value = value.replace(/^\[|\]$/g, '');
      data.tags = value.split(',').map((t) => t.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      continue;
    }
    value = value.replace(/^["']|["']$/g, '');
    if (value === 'true') data[key] = true;
    else if (value === 'false') data[key] = false;
    else data[key] = value;
  }
  return { data, body: m[2] };
}

function build() {
  const seen = new Set();
  const out = [];

  for (const [path, raw] of Object.entries(files)) {
    const file = path.split('/').pop();
    const { data, body } = parseFrontMatter(raw, file);

    const slug = data.slug || file.replace(/\.md$/, '');
    if (!SLUG_RE.test(slug)) {
      throw new Error(`[blog] ${file}: slug "${slug}" must be lowercase letters, numbers and hyphens only`);
    }
    if (seen.has(slug)) throw new Error(`[blog] duplicate slug "${slug}"`);
    seen.add(slug);

    if (!data.title) throw new Error(`[blog] ${file}: "title" is required`);
    if (!DATE_RE.test(data.date || '')) throw new Error(`[blog] ${file}: "date" must look like 2026-11-25`);
    if (data.updated && !DATE_RE.test(data.updated)) throw new Error(`[blog] ${file}: "updated" must look like 2026-11-25`);
    if (data.image && !String(data.image).startsWith('/')) {
      throw new Error(`[blog] ${file}: "image" must start with / (put the file in public/)`);
    }

    const html = md.parse(body);
    const plain = stripTags(html).replace(/\s+/g, ' ').trim();
    const description =
      data.description || (plain.length > 155 ? `${plain.slice(0, 152).trimEnd()}...` : plain);

    out.push({
      slug,
      title: data.title,
      description,
      date: data.date,
      updated: data.updated || null,
      tags: data.tags || [],
      image: data.image || null,
      draft: data.draft === true,
      readingTime: Math.max(1, Math.ceil(plain.split(' ').length / 200)),
      html,
    });
  }

  return out
    .filter((p) => !(import.meta.env.PROD && p.draft)) // drafts only show in `npm run dev`
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const posts = build();
export const getPost = (slug) => posts.find((p) => p.slug === slug);

// Deterministic (no Intl/timezone) so server and browser render identical text.
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
