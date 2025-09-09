// src/composables/useSeo.js
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'

// lightweight helper that can be used from defineOptions preFetch (import-only)
export async function fetchSeoForPath(path) {
  const result = { title: '', description: '' }
  try {
    const res = await fetch(
      `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
    )
    if (!res.ok) return result
    const json = await res.json()
    if (json.title) result.title = json.title
    if (json.description) result.description = json.description
  } catch (err) {
    console.error('[fetchSeoForPath] fetch error', err)
  }
  return result
}

export function useSeo(pathOverride = null, initialSeo = { title: '', description: '' }, fallback = { title: 'Loading...', description: '...' }) {
  const route = useRoute()

  // ✅ initialize with SSR or preFetch data so hydration is consistent
  const seoData = ref({ ...initialSeo })

  async function fetchSeoData(path) {
    try {
      const res = await fetch(
        `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
      )
      if (!res.ok) return
      const json = await res.json()
      if (json.title) seoData.value.title = json.title
      if (json.description) seoData.value.description = json.description
    } catch (err) {
      console.error('[SEO Fetch Error]:', err)
      seoData.value.title = fallback.title
      seoData.value.description = fallback.description
    }
  }

  // ✅ register meta immediately (reactive to seoData)
  useMeta(() => ({
    title: seoData.value.title || initialSeo.title,
    meta: {
      description: { name: 'description', content: seoData.value.description || initialSeo.description },
      'og:title': { property: 'og:title', content: seoData.value.title || initialSeo.title },
      'og:description': { property: 'og:description', content: seoData.value.description || initialSeo.description }
    }
  }))

  // ✅ only update on client navigation
  watch(
    () => route.fullPath,
    (newPath, oldPath) => {
      if (newPath !== oldPath) {
        fetchSeoData(pathOverride || newPath)
      }
    }
  )

  // ❌ removed the onMounted auto-fetch (was overwriting SSR data!)

  return { seoData, fetchSeoData }
}
