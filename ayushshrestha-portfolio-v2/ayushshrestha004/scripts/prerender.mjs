// Runs after `vite build` + the SSR build. Renders every page to real HTML, writes
// one index.html per route (+ 404.html), and regenerates sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const { render, routes, head, sitemap } = await import(
  pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href
)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const ROOT = '<div id="root"></div>'
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
if (!template.includes(ROOT)) throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
if (!SEO_BLOCK.test(template)) throw new Error('prerender: <!-- seo:start --> ... <!-- seo:end --> markers not found in index.html')

function page(url) {
  const markup = render(url)
  if (!markup.includes('<h1')) throw new Error(`prerender: ${url} rendered without an <h1>`)
  return template
    .replace(SEO_BLOCK, `<!-- seo:start -->\n    ${head(url)}\n    <!-- seo:end -->`)
    .replace(ROOT, `<div id="root">${markup}</div>`)
}

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

for (const url of routes()) {
  const file = url === '/' ? path.join(dist, 'index.html') : path.join(dist, url, 'index.html')
  write(file, page(url))
  console.log(`prerender: ${url}`)
}

// Netlify serves this automatically (with a real 404 status) for unknown URLs.
write(path.join(dist, '404.html'), page('/page-not-found/'))
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap())
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log('prerender: 404.html + sitemap.xml written')
