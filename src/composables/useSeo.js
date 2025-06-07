import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import { ref, onServerPrefetch, onMounted } from 'vue'

export function useSeo() {
  const route = useRoute()
  const seoData = ref(null)

  const fetchSeo = async () => {
    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(route.fullPath)}`)
      if (!res.ok) throw new Error(`SEO fetch failed with ${res.status}`)
      seoData.value = await res.json()
    } catch (err) {
      console.warn('[SEO] Failed to fetch:', err)
    }
  }

  // Fetch before SSR renders
  onServerPrefetch(fetchSeo)

  // Fallback for client navigation
  onMounted(async () => {
    if (!seoData.value) await fetchSeo()
  })

  // SSR-safe meta update
  if (import.meta.env.SSR) {
    // only when prefetch succeeded
    onServerPrefetch(async () => {
      if (!seoData.value) return
      useMeta(() => ({
        title: seoData.value.title,
        meta: {
          description: { name: 'description', content: seoData.value.description },
          ogTitle: { property: 'og:title', content: seoData.value.title },
          ogDescription: { property: 'og:description', content: seoData.value.description },
          ogType: { property: 'og:type', content: seoData.value.type }
        }
      }))
    })
  } else {
    // Client-side meta update
    onMounted(() => {
      if (seoData.value) {
        useMeta(() => ({
          title: seoData.value.title,
          meta: {
            description: { name: 'description', content: seoData.value.description },
            ogTitle: { property: 'og:title', content: seoData.value.title },
            ogDescription: { property: 'og:description', content: seoData.value.description },
            ogType: { property: 'og:type', content: seoData.value.type }
          }
        }))
      }
    })
  }
}