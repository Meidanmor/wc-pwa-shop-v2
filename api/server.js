// api/index.js
export default async function handler(req, res) {
  try {
    // We import the compiled SSR entry from the dist folder
    const { handler } = await import('../dist/ssr/index.js');
    return handler(req, res);
  } catch (error) {
    console.error('Vercel Bridge Error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
}