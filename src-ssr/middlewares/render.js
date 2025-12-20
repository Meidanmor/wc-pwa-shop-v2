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

        const ssrContext = {
            req,
            res,
        }

        render(ssrContext)
            .then(html => {
                // If seoData is missing here, preFetch didn't run or didn't receive this object
                const data = ssrContext.state.seoData || {debug: 'Data missing from context'}

                // 1. Check if the image exists and is a valid string
                const hasHeroImage = data.image && typeof data.image === 'string' && data.image.length > 0;

                // 2. Build the preload tag only if the condition is met
                // We use fetchpriority="high" to match your <img> tag hints
                const preloadTag = hasHeroImage
                    ? `<link rel="preload" as="image" href="${data.image}" fetchpriority="high">`
                    : '';
                // Create a safe string for the INITIAL_STATE
                const stateScript = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(ssrContext.state).replace(/</g, '\\u003c')}</script>`
                // Escape for tags
                const safeTitle = escapeHTML(data.title || 'NaturaBloom');
                const safeDesc = escapeHTML(data.description || "Let's Bloom Together");
                // Inject REAL meta tags for the Server (Bots/Google)
                const seoTags = `
      <title>${safeTitle}</title>
      <meta name="description" content="${safeDesc}">
      ${preloadTag}
      <meta property="og:type" content="website">
      <meta property="og:title" content="${safeTitle}">
      <meta property="og:description" content="${safeDesc}">
      ${data.image ? `<meta property="og:image" content="${data.image}">` : ''}
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${safeTitle}">
      <meta name="twitter:description" content="${safeDesc}">    `
                res.send(html.replace('</head>', `${seoTags}${stateScript}</head>`))
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
