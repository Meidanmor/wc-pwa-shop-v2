import { useRoute } from 'vue-router'
import { useMeta, useAsyncData } from 'quasar'

export function useSeo() {
  const route = useRoute()

  const { data } = useAsyncData('seo', async () => {
    const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(route.fullPath)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch SEO data: ${res.status}`)
    }
    return await res.json()
  })

  if (data.value) {
    useMeta(() => ({
      title: data.value.title,
      meta: {
        description: { name: 'description', content: data.value.description },
        ogTitle: { property: 'og:title', content: data.value.title },
        ogDescription: { property: 'og:description', content: data.value.description },
        ogType: { property: 'og:type', content: data.value.type }
      }
    }))
  }
}