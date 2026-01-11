// We use dynamic import because Quasar SSR is likely ESM
export default async function handler(req, res) {
  try {
    const { handler } = await import('../dist/ssr/index.js');
    return handler(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}