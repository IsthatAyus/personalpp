import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.jsx'
import { posts } from './blog/posts'
import { metaFor, headBlock, SITE } from './seo'

// Every URL that should become a real HTML file.
export function routes() {
  const list = ['/']
  if (posts.length > 0) list.push('/blog/')
  for (const p of posts) list.push(`/blog/${p.slug}/`)
  return list
}

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}

export const head = (url) => headBlock(metaFor(url))

export function sitemap() {
  const entry = (loc, lastmod, priority) =>
    `  <url>\n    <loc>${SITE.url}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  const today = new Date().toISOString().slice(0, 10)
  const items = [entry('/', today, '1.0')]
  if (posts.length > 0) items.push(entry('/blog/', posts[0].updated || posts[0].date, '0.7'))
  for (const p of posts) items.push(entry(`/blog/${p.slug}/`, p.updated || p.date, '0.8'))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>\n`
}
