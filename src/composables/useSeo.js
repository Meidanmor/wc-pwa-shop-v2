// src/composables/useSeo.js
import { useMeta } from 'quasar'
import { ref, unref, computed, onServerPrefetch } from 'vue'
import { useRoute } from 'vue-router'

export function useSeo() {
  const route = useRoute()
  const metaData = ref(null)

  const fetchSeo = async () => {
    try {
      const path = encodeURIComponent(route.fullPath)
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${path}`)

      if (!res.ok) throw new Error(`Failed: ${res.status}`)

      metaData.value = await res.json()
    } catch (err) {
      console.error('[SEO] Failed to fetch:', err)
      metaData.value = null
    }
  }

  onServerPrefetch(fetchSeo)

  const meta = computed(() => {
    if (!metaData.value) return {}

    const title = metaData.value.title || 'Fallback Title'
    const description = metaData.value.description || 'Fallback description'

    return {
      title,
      meta: {
        description: { name: 'description', content: description },
        'og:title': { property: 'og:title', content: title },
        'og:description': { property: 'og:description', content: description }
      }
    }
  })

  useMeta(meta)
}
