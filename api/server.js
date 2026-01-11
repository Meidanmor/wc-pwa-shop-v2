import { join } from 'path';
import { pathToFileURL } from 'url';

export default async function handler(req, res) {
  try {
    // Dynamically locate the Quasar index.js relative to this function
    const indexPath = join(process.cwd(), 'dist', 'ssr', 'index.js');

    // Convert to File URL for ESM import compatibility
    const { handler: quasarHandler } = await import(pathToFileURL(indexPath).href);

    return quasarHandler(req, res);
  } catch (error) {
    console.error('Vercel Execution Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    });
  }
}