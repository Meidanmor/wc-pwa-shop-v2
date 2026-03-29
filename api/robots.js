// /api/robots.js
import fetch from 'node-fetch' // only if needed for server-side requests

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')

  // Example: generate sitemap dynamically
  const sitemapUrl = 'https://pwav.meidanm.com/sitemap.xml'

  // You could also fetch your pages/products here and add them to robots.txt if needed

  const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`
  res.send(robotsTxt)
}