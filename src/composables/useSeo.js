import { useMeta } from 'quasar'
import { useRoute } from 'vue-router'

export async function useSeo() {
  const route = useRoute()

  try {
    const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(route.fullPath)}`)
    if (!res.ok) throw new Error(`Failed to fetch SEO data: ${res.status}`)
    const data = await res.json()

    useMeta(() => ({
      title: data.title,
      meta: {
        description: { name: 'description', content: data.description },
        ogTitle: { property: 'og:title', content: data.title },
        ogDescription: { property: 'og:description', content: data.description },
        ogType: { property: 'og:type', content: data.type }
      }
    }))
  } catch (err) {
    console.warn('[SEO] Failed to fetch:', err)
  }
}
