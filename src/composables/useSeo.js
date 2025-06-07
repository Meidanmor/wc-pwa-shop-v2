import { useMeta } from 'quasar'
import { ref, unref, computed, watchEffect, onMounted, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router'

export function useAppMeta(pageSpecificMeta = {}) {
  const route = useRoute()
  const fetchedData = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    const fullPath = route.fullPath
    if (!fullPath) return

    const apiUrl = `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(fullPath)}`
    isLoading.value = true
    error.value = null

    try {
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Status: ${res.status}`)
      fetchedData.value = await res.json()
    } catch (err) {
      error.value = err
      console.error('[SEO] Fetch failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  onServerPrefetch(fetchData)
  onMounted(() => {
    if (!fetchedData.value) fetchData()
  })

  // Safe meta injection (delayed until fetchedData is available)
  watchEffect(() => {
    if (!fetchedData.value) return

    const pageMeta = unref(pageSpecificMeta)
    const title = unref(
      pageMeta.title ||
      fetchedData.value.title ||
      'Untitled Page'
    )
    const description = unref(
      pageMeta.meta?.description?.content ||
      fetchedData.value.description ||
      'A Quasar Framework App.'
    )

    useMeta(() => ({
      title,
      titleTemplate: pageMeta.titleTemplate || (t => `${t} - My Awesome Quasar App`),
      meta: {
        ...{
          description: { name: 'description', content: description },
          keywords: { name: 'keywords', content: 'quasar, vue, frontend, app' },
          'og:title': { property: 'og:title', content: title },
          'og:description': { property: 'og:description', content: description },
          'og:type': { property: 'og:type', content: 'website' },
          'og:site_name': { property: 'og:site_name', content: 'My Awesome Quasar App' },
          'og:image': { property: 'og:image', content: fetchedData.value.imageUrl || 'https://example.com/default.jpg' },
        },
        ...pageMeta.meta
      }
    }))
  })

  return {
    fetchedData,
    isLoading,
    error,
  }
}
