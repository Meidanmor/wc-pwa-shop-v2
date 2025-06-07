import { useMeta } from 'quasar'

export default async ({ ssrContext, router }) => {
  if (process.env.SERVER) {
    const path = ssrContext.url

    try {
      const res = await fetch(`https://nuxt-meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`)
      const data = await res.json()

      // Inject meta into SSR context
      ssrContext.meta = {
        title: data.title,
        meta: {
          description: { name: 'description', content: data.description },
          ogTitle: { property: 'og:title', content: data.title },
          ogDescription: { property: 'og:description', content: data.description },
          ogType: { property: 'og:type', content: data.type }
        }
      }
    } catch (err) {
      console.warn('SSR SEO fetch failed:', err)
    }
  } else {
    // Fallback on client: still update meta dynamically for navigation
    router.afterEach(async (to) => {
      try {
        const res = await fetch(`https://nuxt-meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(to.fullPath)}`)
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
        console.warn('Client SEO fetch failed:', err)
      }
    })
  }
}
