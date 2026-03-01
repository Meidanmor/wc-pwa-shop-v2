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
                const productData = ssrContext.productData || {};
                const productsData = ssrContext.productsData || {};
                const heroData = ssrContext.heroData || {};

                const safeTitle = escapeHTML(seoData?.title || 'NaturaBloom');
                const safeDesc = escapeHTML(seoData?.description || "Let's Bloom Together");
                const safeRobots = escapeHTML(seoData?.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
                const safeOgType = escapeHTML(seoData?.og_type || 'website');
                const safeOgImage = escapeHTML(seoData?.og_image || '');

                // 1. GENERATE SCHEMA (JSON-LD)
                // This allows Google to show Price, Rating, and Stock in search results.
                let schemaHtml = '';
                if (productData && productData.id) {
                    const schema = {
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": safeTitle,
                        "description": safeDesc,
                        "image": [safeOgImage],
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "ILS", // Change to your currency
                            "price": productData.price || '0',
                            "availability": productData.stock_status === 'instock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    };
                    schemaHtml = `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`;
                }

                // 2. CRITICAL HEAD TOP: Connections, Styles, Pixels, and SEO
                const criticalHeadTop = `
    <link rel="preconnect" href="https://nuxt.meidanm.com" crossorigin>
    <link rel="dns-prefetch" href="https://nuxt.meidanm.com">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}">
    <meta name="robots" content="${safeRobots}">
    
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:image" content="${safeOgImage}">
    <meta property="og:type" content="${safeOgType}">
    <meta name="twitter:card" content="summary_large_image">

    ${schemaHtml}

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
      .hero-section-sec, .lcp-wrapper, .hero-img, .q-layout, .q-page-container, #q-app {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        transition: none !important;
        animation: none !important;
      }
    </style>
  `;

                // 3. HEAVY DATA: Bottom of body
                const bodyBottom = `
    <script>window.__SEO_DATA__ = ${JSON.stringify(seoData).replace(/</g, '\\u003c')}</script>
    <script>window.__PRODUCTS_DATA__ = ${JSON.stringify(productsData).replace(/</g, '\\u003c')}</script>
    <script>window.__PRODUCT_DATA__ = ${JSON.stringify(productData).replace(/</g, '\\u003c')}</script>
  `;

                // 4. SURGICAL PLACEMENT
                const output = html
                    .replace(/<title>.*?<\/title>/i, '')
                    .replace('<head>', `<head>${criticalHeadTop}`)
                    .replace('</body>', `${bodyBottom}</body>`);

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
