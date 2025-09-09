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

        render({req, res})
            .then(html => res.send(html))
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
