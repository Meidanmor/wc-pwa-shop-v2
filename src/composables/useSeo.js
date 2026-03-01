// src/composables/useSeo.js
// lightweight helper that can be used from defineOptions preFetch (import-only)
export async function fetchSeoForPath(path) {
  // Define default fallbacks
  const result = {
    title: 'NaturaBloom',
    description: "Let's Bloom Together",
    robots: 'index, follow, max-image-preview:large',
    og_image: '',
    og_type: 'website'
  }

  try {
    const res = await fetch(
      `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
    )

    if (!res.ok) return result

    const json = await res.json()

    // Use the Spread operator (...) to merge the API data
    // into your result object. This keeps all new fields!
    return { ...result, ...json }

  } catch (err) {
    console.error('[fetchSeoForPath] fetch error', err)
    return result
  }
}