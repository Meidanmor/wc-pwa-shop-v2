// ssr-src/middlewares/render.js
import { defineSsrMiddleware } from '#q-app/wrappers'
import fs from 'fs'
import path from 'path'
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
// Global cache to avoid reading disk on every request
let cachedMainCss = '';
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
                // --- 1. DYNAMIC CSS EXTRACTION ---
                if (!cachedMainCss || process.env.DEV) {
                    try {
                        // Find the main index CSS file in the client dist folder
                        const assetsDir = path.resolve(__dirname, '../client/assets');
                        const files = fs.readdirSync(assetsDir);
                        const mainCssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

                        if (mainCssFile) {
                            cachedMainCss = fs.readFileSync(path.join(assetsDir, mainCssFile), 'utf-8');
                        }
                    } catch (e) {
                        console.error('Inlining error:', e);
                    }
                }

                const seoData = ssrContext.seoData || {};
                const productsData = ssrContext.productsData || {};
                const heroData = ssrContext.heroData || {};

                const safeTitle = escapeHTML(seoData.title || 'NaturaBloom');
                const safeDesc = escapeHTML(seoData.description || "Let's Bloom Together");

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
          <style>${cachedMainCss}</style> <style>
            /* Your manual hero styles remain here */
            .hero-section-sec{--text:#1e1e1e;--muted:#6f6f6f;--primary1:#f6f2e7;--primary2:#e9ddc4;--primary3:#d0c1a3;--primary4:#bfa07c;--primary5:#a88360;--card-shadow:0 12px 40px rgba(16,16,16,0.08);position:relative;inset:0;background:linear-gradient(270deg,var(--primary1),var(--primary2),var(--primary3),var(--primary4),var(--primary5));background-size:1200% 1200%;animation:none;display:flex;align-items:center}.hero-section-sec:before{content:"";position:absolute;width:100%;height:100%;z-index:0;top:0;left:0;background:radial-gradient(circle at 20% 30%,#fff 0,transparent 60%),radial-gradient(circle at 80% 70%,rgba(255,255,255,.7) 0,transparent 60%),radial-gradient(circle at 50% 50%,rgba(255,255,255,.38) 0,#00000000 60%);background-size:200% 200%}.hero-section{padding:0 20px;position:relative;overflow:hidden;z-index:1;width:100%}.hero-content h1{overflow-wrap:anywhere;text-indent:-4px;font-weight:600;font-size:14vw;line-height:1.1;margin-top:0;margin-bottom:12px;display:block}.hero-content .text-h6{max-width:400px;margin-bottom:24px!important}.lcp-wrapper{display:block;width:100%;aspect-ratio:3/2;position:relative;overflow:hidden;border-radius:50px;background:rgba(0,0,0,.03);contain:paint;transform:translateZ(0)}.hero-img{width:100%;height:100%;display:block;object-fit:cover}.hero-content button.hero-btn{border-radius:50px;padding:10px 24px;color:#fff;background:var(--primary-gradient);border:none;cursor:pointer;position:relative;font-weight:600;height:44px;display:inline-flex;align-items:center;justify-content:center}.hero-content button:before{content:"";display:block;position:absolute;inset:0;border-radius:inherit;box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);transition:box-shadow .3s cubic-bezier(.25,.8,.5,1)}.hero-content button:hover .q-focus-helper{opacity:1}@media (min-width:768px){.lcp-wrapper{width:50%}.hero-content h1{font-size:4rem}}
          </style>
        `;

                const bodyBottom = `
          <script>window.__SEO_DATA__ = ${JSON.stringify(seoData).replace(/</g, '\\u003c')}</script>
          <script>window.__PRODUCTS_DATA__ = ${JSON.stringify(productsData).replace(/</g, '\\u003c')}</script>
        `;

                // --- 2. SURGICAL CLEANUP ---
                const output = html
                    // Remove the default title
                    .replace(/<title>.*?<\/title>/i, '')
                    // IMPORTANT: Remove the external CSS link tag so it doesn't download twice
                    .replace(/<link [^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*index-[^"']*\.css["'][^>]*>/gi, '')
                    // Inject our optimized head
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
