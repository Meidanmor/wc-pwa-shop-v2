export async function loadPageConfig(page, isPreview) {
  const API_BASE =
  import.meta.env.SSR
    ? process.env.VITE_API_BASE
    : import.meta.env.VITE_API_BASE

  // --- SERVER SIDE LOGIC ---
if (import.meta.env.SSR) {
  try {
    // 1. If Preview, fetch from WordPress API (keep as-is — HTTP fetch is correct here)
    if (isPreview) {
      const url = `${API_BASE}/wp-json/shop-builder/v1/preview/${page}`;
      console.log(`[SSR] Fetching Preview from API: ${url}`);

      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return await response.json();
      throw new Error(`WP API responded with ${response.status}`);
    }

    // 2. If NOT Preview, read directly from filesystem
    const { readFile } = await import('fs/promises')
    const { resolve } = await import('path')

    const isDev = import.meta.env.DEV
    const basePath = isDev
      ? resolve(process.cwd(), 'public', 'config')
      : resolve(process.cwd(), 'client', 'config') // dist/ssr/client/config in prod

    const filePath = resolve(basePath, `${page}.json`)
    console.log(`[SSR] Reading config from filesystem: ${filePath}`)

    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)

  } catch (err) {
    console.error('[SSR] loadPageConfig Error:', err.message);
    return {};
  }
}
  // --- CLIENT SIDE LOGIC ---
  else {
    try {
      const url = isPreview
        ? `${API_BASE}/wp-json/shop-builder/v1/preview/${page}`
        : `/config/${page}.json`;

      const response = await fetch(url, {
        cache: 'no-store'
      });
      if (!response.ok) return {};
      return await response.json();
    } catch (err) {
      console.error('[Client] loadPageConfig Error:', err);
      return {};
    }
  }
}