// /api/sitemap.js
import fetch from 'node-fetch'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml')

  const products = await fetch('https://nuxt.meidanm.com/wp-json/wc/store/products')
    .then(r => r.json())
    .catch(() => [])

  const urls = [
    `<url><loc>https://pwav.meidanm.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...products.map(p => `<url><loc>https://pwav.meidanm.com/product/${p.slug}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  res.send(xml)
}