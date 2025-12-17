// ssr-src/middlewares/render.js
import { defineSsrMiddleware } from '#q-app/wrappers'

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
  _meta: {} // Quasar often expects this
}

render(ssrContext)
  .then(html => {
    // DEBUG: See what Quasar did to our object
    console.log('--- Context Keys:', Object.keys(ssrContext))

    // If seoData is missing here, preFetch didn't run or didn't receive this object
    const data = ssrContext.seoData || { debug: 'Data missing from context' }

    // Inject REAL meta tags for the Server (Bots/Google)
const seoTags = `
      <title>${data.title}</title>
      <meta name="description" content="${data.description}">
      <meta property="og:type" content="website">
      <meta property="og:title" content="${data.title}">
      <meta property="og:description" content="${data.description}">
      ${data.image ? `<meta property="og:image" content="${data.image}">` : ''}
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${data.title}">
      <meta name="twitter:description" content="${data.description}">
      <script>window.__SEO_DATA__ = ${JSON.stringify(data)}</script>
    `
      res.send(html.replace('</head>', `${seoTags}</head>`))
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
