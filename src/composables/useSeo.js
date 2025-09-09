import { ref, onServerPrefetch, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

export function useSeo(pathOverride = null, initialSeo = { title: '', description: '' }) {
  const route = useRoute()
  const seoData = ref({ ...initialSeo })

  async function fetchSeoData(path) {
    try {
      const res = await fetch(
        `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
      )
      const json = await res.json()
      if (json.title) seoData.value.title = json.title
      if (json.description) seoData.value.description = json.description
    } catch (err) {
      console.error('[SEO Fetch Error]:', err)
      // fallback to initialSeo
      seoData.value = { ...initialSeo }
    }
  }

  // --- SSR blocking
  onServerPrefetch(async () => {
    await fetchSeoData(pathOverride || route.fullPath)
  })

  useMeta(() => ({
    title: seoData.value.title,
    meta: {
      description: { name: 'description', content: seoData.value.description },
      'og:title': { property: 'og:title', content: seoData.value.title },
      'og:description': { property: 'og:description', content: seoData.value.description }
    }
  }))

  watch(
    () => route.fullPath,
    (newPath) => fetchSeoData(pathOverride || newPath),
    { immediate: true }
  )

  return { seoData, fetchSeoData }
}
