export default async ({ router, ssrContext }) => {
  async function fetchSeo(path) {
    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error(`SEO fetch failed with status ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('SEO fetch error:', e);
      return null;
    }
  }

  // 1. Server-side: set meta directly using ssrContext
  if (ssrContext) {
    const seoData = await fetchSeo(ssrContext.url || '/');
    if (seoData) {
      ssrContext.meta = {
        title: seoData.title,
        meta: [
          { name: 'description', content: seoData.description },
          { property: 'og:title', content: seoData.title },
          { property: 'og:description', content: seoData.description },
          { property: 'og:type', content: seoData.type }
        ]
      };
    }
  }

  // 2. Client-side: useMeta after route changes
  if (process.env.CLIENT) {
    router.afterEach(async (to) => {
      const seoData = await fetchSeo(to.fullPath);
      if (seoData) {
        const { useMeta } = await import('quasar'); // lazy import to ensure it's client-side
        useMeta(() => ({
          title: seoData.title,
          meta: {
            description: { name: 'description', content: seoData.description },
            ogTitle: { property: 'og:title', content: seoData.title },
            ogDescription: { property: 'og:description', content: seoData.description },
            ogType: { property: 'og:type', content: seoData.type }
          }
        }));
      }
    });
  }
};