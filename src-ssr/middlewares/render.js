// ssr-src/middlewares/render.js
import { defineSsrMiddleware } from '#q-app/wrappers'
// 1. Define the helper at the top of the file
const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
export default defineSsrMiddleware(({ app, resolve, render, serve }) => {
    app.get(resolve.urlPath('*'), (req, res) => {
        res.setHeader('Content-Type', 'text/html')

        // CSP header matching your htmlVariables settings
        res.setHeader(
            'Content-Security-Policy',
            "default-src 'self'; " +
            "script-src 'self' https://accounts.google.com 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' https://nuxt.meidanm.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "frame-src https://accounts.google.com;"
        )

const ssrContext = { req, res }

render(ssrContext)
  .then(html => {
      const seoData = ssrContext.seoData || {};
      const productsData = ssrContext.productsData || {};
      const heroData = ssrContext.heroData || {}; // ✅ Catch the hero data

      const stateScripts = `
      <script>window.__SEO_DATA__ = ${JSON.stringify(seoData).replace(/</g, '\\u003c')}</script>
      <script>window.__PRODUCTS_DATA__ = ${JSON.stringify(productsData).replace(/</g, '\\u003c')}</script>
    `;

      const safeTitle = escapeHTML(seoData.title || 'NaturaBloom');
      const safeDesc = escapeHTML(seoData.description || "Let's Bloom Together");

      // ✅ Use the passed heroData for the preload tag
      const heroPreload = heroData.src ? `
        <link 
          rel="preload" 
          as="image" 
          href="${heroData.src}" 
          imagesrcset="${heroData.srcset}" 
          imagesizes="${heroData.sizes}" 
          fetchpriority="high"
        >` : '';

      const dynamicSeo = `
      <title>${safeTitle}</title>
      <meta name="description" content="${safeDesc}">
      ${heroPreload}      
      ${stateScripts}
    `;

      // SURGICAL REPLACEMENT:
      // We remove the default title (to avoid duplicates) and inject our SEO.
      const output = html
          .replace(/<title>.*?<\/title>/i, '')
          .replace('</head>', `${dynamicSeo}</head>`);

      res.send(output);
  })
    .catch(err => {
                if (err.url) {
                    if (err.code) res.redirect(err.code, err.url)
                    else res.redirect(err.url)
                } else if (err.code === 404) {
                    res.status(404).send('404 | Page Not Found')
                } else if (process.env.DEV) {
                    serve.error({err, req, res})
                } else {
                    res.status(500).send('500 | Internal Server Error')
                    if (process.env.DEBUGGING) console.error(err.stack)
                }
            })
    })
})
