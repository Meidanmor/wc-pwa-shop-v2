// src/composables/useSeo.js
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

export async function useSeo(pathOverride = null, initialSeo = { title: '', description: '' }) {
  const route = useRoute()
  const seoData = ref(initialSeo)

  useMeta(() => ({
    title: seoData.value.title,
    meta: {
      description: { name: 'description', content: seoData.value.description },
      'og:title': { property: 'og:title', content: seoData.value.title },
      'og:description': { property: 'og:description', content: seoData.value.description }
    }
  }))

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
    }
  }

  // fetch once immediately (and return promise so caller can await)
  const initialPromise = fetchSeoData(pathOverride || route.fullPath)

  // keep watching after mount
  watch(
    () => route.fullPath,
    (newPath) => fetchSeoData(pathOverride || newPath)
  )

  return { seoData, fetchSeoData, ready: initialPromise }
}