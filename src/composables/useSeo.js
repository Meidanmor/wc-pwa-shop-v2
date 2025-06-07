import { useMeta } from 'quasar'
import { ref, unref, onServerPrefetch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export function useAppMeta(pageSpecificMeta = {}) {
  const route = useRoute()
  const fetchedData = ref(null)
  const error = ref(null)

  const setMeta = () => {
    const pageMeta = unref(pageSpecificMeta)
    const title = unref(pageMeta.title || fetchedData.value?.title || 'Untitled Page')
    const description = unref(
      pageMeta.meta?.description?.content ||
      fetchedData.value?.description ||
      'A Quasar Framework App.'
    )

    useMeta({
      title,
      titleTemplate: pageMeta.titleTemplate || (t => `${t} - My Awesome Quasar App`),
      meta: {
        description: { name: 'description', content: description },
        keywords: { name: 'keywords', content: 'quasar, vue, frontend, app' },
        'og:title': { property: 'og:title', content: title },
        'og:description': { property: 'og:description', content: description },
        'og:type': { property: 'og:type', content: 'website' },
        'og:site_name': { property: 'og:site_name', content: 'My Awesome Quasar App' },
        'og:image': {
          property: 'og:image',
          content: fetchedData.value?.imageUrl || 'https://example.com/default-image.jpg'
        },
        ...pageMeta.meta
      }
    })
  }

  const fetchData = async () => {
    const fullPath = route.fullPath
    if (!fullPath) return

    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(fullPath)}`)
      if (!res.ok) throw new Error(`Status: ${res.status}`)
      fetchedData.value = await res.json()
    } catch (err) {
      error.value = err
      console.error('[SEO] Fetch error:', err)
    }
  }

  // Prefetch on SSR
  onServerPrefetch(async () => {
    await fetchData()
    setMeta() // <-- set meta right after fetch during SSR
  })

  // Run on client if SSR didn’t run
  onMounted(async () => {
    if (!fetchedData.value) {
      await fetchData()
      setMeta()
    }
  })

  return { fetchedData, error }
}
