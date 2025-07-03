export default async ({ /*req,*/ res }) => {
    /*res.setHeader(
        'Content-Security-Policy',
        "default-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
    )*/
    res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://accounts.google.com; object-src 'none'"
    )

}
