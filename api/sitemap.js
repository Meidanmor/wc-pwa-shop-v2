// api/sitemap.js
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pwav.meidanm.com/</loc>
    <priority>1.0</priority>
  </url>
  <!-- Add more pages here if needed -->
</urlset>
`;

  res.status(200).send(sitemap.trim());
}