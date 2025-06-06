import { useMeta } from 'quasar'

export default ({ router }) => {
  router.afterEach(async (to) => {
    try {
      const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(to.fullPath)}`)

      if (!res.ok) {
        throw new Error(`SEO fetch failed with status ${res.status}`)
      }

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
      console.warn('SEO fetch failed:', err)
    }
  })
}
