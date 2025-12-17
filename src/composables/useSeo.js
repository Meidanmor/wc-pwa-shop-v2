// src/composables/useSeo.js
// lightweight helper that can be used from defineOptions preFetch (import-only)
export async function fetchSeoForPath(path) {
  const result = { title: '', description: '' }
  try {
    const res = await fetch(
      `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent(path)}`
    )
    if (!res.ok) return result
    const json = await res.json()
    if (json.title) result.title = json.title
    if (json.description) result.description = json.description
  } catch (err) {
    console.error('[fetchSeoForPath] fetch error', err)
  }
  return result
}