// src/composables/use-app-meta.js
import { useMeta } from 'quasar';
import { computed, unref } from 'vue';

export function useAppMeta(pageSpecificMeta = {}) {
  const defaultTitleTemplate = title => `${unref(title) || 'Untitled Page'} - My Awesome Quasar App`;

  const fetchSeo = async () => {
    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(route.fullPath)}`)
      if (!res.ok) throw new Error(`SEO fetch failed with ${res.status}`)
      seoData.value = await res.json()
    } catch (err) {
      console.warn('[SEO] Failed to fetch:', err)
    }
  }
  // Define your global/default meta properties
  const globalMeta = {
    meta: {
      description: { name: 'description', content: res.value.description },
      keywords: { name: 'keywords', content: '' },
      'og:title': { property: 'og:title', content: res.value.title },
      'og:description': { property: 'og:description', content: res.value.description },
      'og:type': { property: 'og:type', content: 'website' },
      'og:site_name': { property: 'og:site_name', content: 'My Awesome Quasar App' },
      // Add other common meta tags
    },
    // You can also define a global titleTemplate here
    titleTemplate: defaultTitleTemplate,
  };

  // Merge global meta with page-specific meta
  // Page-specific meta will override global meta if keys are the same
  const finalMeta = computed(() => {
    const mergedMeta = {
      ...globalMeta.meta,
      ...unref(pageSpecificMeta).meta, // Ensure pageSpecificMeta is unrefed if it's a ref
    };

    const title = unref(pageSpecificMeta).title || 'Untitled Page';
    const titleTemplate = unref(pageSpecificMeta).titleTemplate || defaultTitleTemplate;

    return {
      title,
      titleTemplate,
      meta: mergedMeta,
      // You can also add other root-level properties here like htmlAttr, bodyAttr, link, script etc.
      // e.g., htmlAttr: { lang: 'en' },
    };
  });

  useMeta(finalMeta);
}