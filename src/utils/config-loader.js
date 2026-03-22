import path from 'path'
import fs from 'fs'

export async function loadPageConfig(page, isPreview) {
  // --- SERVER SIDE LOGIC ---
  if (import.meta.env.SSR) {
    try {
      // 1. If Preview, fetch from WordPress API
      if (isPreview) {
        const url = `https://pwav.meidanm.com/wp-json/shop-builder/v1/preview/${page}`;
        console.log(`[SSR] Fetching Preview from API: ${url}`);

        // We use a dynamic import for 'node-fetch' or similar if global fetch isn't available
        // but usually, in Quasar SSR, global fetch is available.
        const response = await fetch(url);
        if (response.ok) return await response.json();
        throw new Error(`WP API responded with ${response.status}`);
      }

      // 2. If NOT Preview, read from local public folder (like products.js)
      const filePath = path.join(process.cwd(), `public/config/${page}.json`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      }

      console.warn(`[SSR] Config file not found at: ${filePath}`);
      return {};
    } catch (err) {
      console.error('[SSR] loadPageConfig Error:', err.message);
      return {}; // Return empty object to prevent 500 error
    }
  }

  // --- CLIENT SIDE LOGIC ---
  else {
    try {
      const url = isPreview
        ? `https://pwav.meidanm.com/wp-json/shop-builder/v1/preview/${page}`
        : `/config/${page}.json`;

      const response = await fetch(url);
      if (!response.ok) return {};
      return await response.json();
    } catch (err) {
      console.error('[Client] loadPageConfig Error:', err);
      return {};
    }
  }
}