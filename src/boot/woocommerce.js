// src/boot/woocommerce.js
import { fetchWithToken } from 'src/composables/useApiFetch.js'

const baseURL = 'https://nuxt.meidanm.com/wp-json/wc/store/v1'

// --- API functions (unchanged) ---
export const fetchAPI = async (endpoint) => {
  try {
    const res = await fetchWithToken(`${baseURL}${endpoint}`, { credentials: 'include' })

    if (!res || !res.ok) {
      console.error(`[fetchAPI] WooCommerce API error: ${res?.status ?? 'unknown'}`)
      return null
    }

    return await res.json()
  } catch (err) {
    console.error('[fetchAPI] Failed to fetch:', err)
    return null
  }
}

export async function fetchProductById(id) {
  const res = await fetchWithToken(`${baseURL}/products/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Product not found')
  return await res.json()
}

export async function fetchAllProducts() {
  const response = await fetchWithToken(`${baseURL}/products?per_page=100`, { credentials: 'include' })
  const data = await response.json()
  return data
}

export async function fetchAdminProducts() {
  const base = 'https://nuxt.meidanm.com/wp-json/wc/v3/products?per_page=100'

  try {
    // We run both requests at the same time for speed
    const [draftsRes, publishRes] = await Promise.all([
      fetchWithToken(`${base}&status=draft`, { credentials: 'include' }),
      fetchWithToken(`${base}&status=publish`, { credentials: 'include' })
    ])

    const drafts = await draftsRes.json()
    const published = await publishRes.json()

    console.log(drafts);
    console.log(published);
    // Combine them into one array
    return [...(Array.isArray(drafts) ? drafts : []), ...(Array.isArray(published) ? published : [])]
  } catch (err) {
    console.error('[fetchAdminProducts] Failed parallel fetch:', err)
    return []
  }
}

// --- default export for convenience ---
const WC = {
  getProducts: () => fetchAPI('/products?per_page=100'),
  getProductBySlug: (slug) => fetchAPI(`/products/${slug}`),
  getCategories: () => fetchAPI('/products/categories'),
  getAdminProducts: () => fetchAdminProducts()
}

export default WC

// --- CLIENT-SIDE BOOT LOGIC (delayed) ---
export async function initWooCommerceBoot() {
  if (typeof window === 'undefined') return // only run on client

  // Example: load initial products after page render (optional)
  try {
    const products = await WC.getProducts()
    console.log('🚀 WooCommerce products loaded:', products)
  } catch (err) {
    console.error('[WooCommerce boot] failed to load products:', err)
  }
}
