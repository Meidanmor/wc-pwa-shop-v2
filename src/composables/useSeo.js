import { ref, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router'

export function useSeoData() {
  const route = useRoute()
  const seo = ref(null)

  const fetchSeo = async () => {
    try {
      const path = encodeURIComponent(route.fullPath)
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${path}`)
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      seo.value = await res.json()
    } catch (err) {
      console.error('[useSeoData] Failed to fetch SEO:', err)
      seo.value = null
    }
  }

  onServerPrefetch(fetchSeo)

  return {
    seo,
    fetchSeo,
  }
}
