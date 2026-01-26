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

        const ssrContext = {req, res}

        render(ssrContext)
            .then(html => {
                const seoData = ssrContext.seoData || {};
                const productsData = ssrContext.productsData || {};
                const heroData = ssrContext.heroData || {};

                const safeTitle = escapeHTML(seoData?.title || 'NaturaBloom');
                const safeDesc = escapeHTML(seoData?.description || "Let's Bloom Together");

                // 1. CRITICAL HEAD TOP: Connections, Styles, and Pixels
                // This goes at the very top so the browser starts downloading the image
                // and layout while it waits for the 901ms Quasar CSS.
                const criticalHeadTop = `
    <link rel="preconnect" href="https://nuxt.meidanm.com" crossorigin>
    <link rel="dns-prefetch" href="https://nuxt.meidanm.com">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}">
    ${heroData.src ? `
      <link 
        rel="preload" 
        as="image" 
        href="${heroData.src}" 
        imagesrcset="${heroData.srcset}" 
        imagesizes="${heroData.sizes}" 
        fetchpriority="high"
      >` : ''}
    <style>
    /* 1. Force everything in the LCP area to be visible instantly */
  .hero-section-sec, 
  .lcp-wrapper, 
  .hero-img, 
  .q-layout, 
  .q-page-container,
  #q-app {
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important; /* or block, matching your hero class */
    transition: none !important;
    animation: none !important;
  }
</style>
  `;

                // 2. HEAVY DATA: Move to the very bottom of the body.
                // This prevents the browser from having to parse massive JSON before it draws the page.
                const bodyBottom = `
    <script>window.__SEO_DATA__ = ${JSON.stringify(seoData).replace(/</g, '\\u003c')}</script>
    <script>window.__PRODUCTS_DATA__ = ${JSON.stringify(productsData).replace(/</g, '\\u003c')}</script>
  `;

                // 3. SURGICAL PLACEMENT:
                const output = html
                    .replace(/<title>.*?<\/title>/i, '') // Remove Quasar's default title
                    .replace('<head>', `<head>${criticalHeadTop}`) // Inject critical stuff at the TOP
                    .replace('</body>', `${bodyBottom}</body>`); // Inject heavy JSON at the BOTTOM

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
