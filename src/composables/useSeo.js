import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

export function useSeo(pathOverride = null, initialSeo = { title: '', description: '' }) {
  const route = useRoute()
  const seoData = ref({ ...initialSeo })

  // 1. Set meta synchronously (SSR-safe)
  useMeta(() => ({
    title: seoData.value.title,
    meta: {
      description: { name: 'description', content: seoData.value.description },
      'og:title': { property: 'og:title', content: seoData.value.title },
      'og:description': { property: 'og:description', content: seoData.value.description }
    }
  }))

  // 2. Fetch SEO asynchronously (server & client)
  async function fetchSeo(path) {
    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`)
      const json = await res.json()
      seoData.value.title = json.title || initialSeo.title
      seoData.value.description = json.description || initialSeo.description
    } catch (err) {
      console.error('[SEO Fetch Error]:', err)
    }
  }

  // Client-side navigation updates
  watch(
    () => route.fullPath,
    (newPath) => fetchSeo(pathOverride || newPath),
    { immediate: true }
  )

  // Optional: call once on mounted
  onMounted(() => fetchSeo(pathOverride || route.fullPath))

  return { seoData, fetchSeo }
}
