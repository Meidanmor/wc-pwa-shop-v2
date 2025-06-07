// composables/useSeo.js
import { useMeta } from 'quasar'

export async function useSeo(path) {
  const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`)
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
}