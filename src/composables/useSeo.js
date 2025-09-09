// src/composables/useSeo.js
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

export function useSeo(pathOverride = null, initialSeo = { title: '', description: '' }) {
  const route = useRoute()
  const seoData = ref(initialSeo) // hardcoded defaults shown immediately
  // reactive meta including Open Graph tags

  async function fetchSeoData(path) {
    try {
      const res = await fetch(
        `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
      )
      const json = await res.json()
      if (json.title) seoData.value.title = json.title
      if (json.description) seoData.value.description = json.description
      //console.log('[SEO] Fetched:', json.title)
    } catch (err) {
      console.error('[SEO Fetch Error]:', err)
      // seoData.value remains default if API fails
    } finally {
      useMeta(() => ({
        title: seoData.value.title,
        meta: {
          description: {name: 'description', content: seoData.value.description},
          'og:title': {property: 'og:title', content: seoData.value.title},
          'og:description': {property: 'og:description', content: seoData.value.description}
        }
      }))
    }
  }

  // initial fetch
  async function waitForSEOFetch() {
    await fetchSeoData(pathOverride || route.fullPath)
  }

  waitForSEOFetch()
  // watch route changes
  watch(
    () => route.fullPath,
    (newPath) => fetchSeoData(pathOverride || newPath)
  )

  return { waitForSEOFetch }
}
