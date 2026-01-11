import { join } from 'path';
import { pathToFileURL } from 'url';

export default async function handler(req, res) {
  try {
    const indexPath = join(process.cwd(), 'dist', 'ssr', 'index.js');
    const quasarServer = await import(pathToFileURL(indexPath).href);

    // Quasar ESM builds usually export the handler as '_e'
    // We check for 'handler' first, then '_e', then 'default'
    const render = quasarServer.handler || quasarServer._e || quasarServer.default;

    if (typeof render !== 'function') {
      throw new Error(`No valid handler found. Exports: ${Object.keys(quasarServer).join(', ')}`);
    }

    return render(req, res);
  } catch (error) {
    console.error('Vercel Execution Error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      keys: error.keys // Helping us debug if it fails again
    });
  }
}