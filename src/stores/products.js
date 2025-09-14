// src/stores/products.js
import { ref } from 'vue'
import { useSSRContext } from 'vue'
import api from 'src/boot/woocommerce'

// --- reactive state ---
const products = ref([])
const productsLoading = ref(false)
const initialized = ref(false)

const SSR_KEY = '__PRE_FETCH_PRODUCTS__'

// --- core fetchers ---
async function preFetchProducts(ctx) {
  try {
    productsLoading.value = true
    const allProducts = await api.getProducts()

    if (Array.isArray(allProducts)) {
      products.value = allProducts
      initialized.value = true
      // save into SW cache
      await writeProductsToCache(allProducts)
    } else {
      products.value = []
    }

    // SSR hydration support
    if (ctx?.ssrContext) {
      ctx.ssrContext[SSR_KEY] = allProducts
    } else if (typeof window !== 'undefined') {
      window[SSR_KEY] = allProducts
    }
  } catch (err) {
    console.error('[products store] preFetchProducts error', err)
    products.value = []
  } finally {
    productsLoading.value = false
  }
}

function initFromSSR() {
  if (initialized.value) return

  let pre = []
  if (import.meta.env.SSR) {
    try {
      const ssr = useSSRContext()
      pre = ssr?.[SSR_KEY] || []
    } catch(err) {
      console.warn(err)
    }
  } else if (typeof window !== 'undefined') {
    pre = window?.[SSR_KEY] || []
  }

  if (pre && Array.isArray(pre) && pre.length) {
    products.value = pre
    initialized.value = true
  }
}

async function fetchProductsIfNeeded() {
  if (initialized.value && products.value.length) return products.value

  // 1) SSR hydration
  initFromSSR()
  if (initialized.value && products.value.length) return products.value

  // 2) SW cache
  const cached = await readProductsFromCache()
  if (cached?.length) {
    products.value = cached
    initialized.value = true
    return products.value
  }

  // 3) fallback network
  await preFetchProducts()
  return products.value
}

// --- SW cache helpers ---
async function readProductsFromCache() {
  if (typeof window === 'undefined' || !('caches' in window)) return null
  try {
    const cache = await caches.open('products-cache')
    const res = await cache.match('/api/products') // must match endpoint
    if (res) return await res.json()
  } catch (err) {
    console.error('readProductsFromCache failed', err)
  }
  return null
}

async function writeProductsToCache(data) {
  if (typeof window === 'undefined' || !('caches' in window)) return
  try {
    const cache = await caches.open('products-cache')
    await cache.put(
      '/api/products',
      new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      })
    )
  } catch (err) {
    console.error('writeProductsToCache failed', err)
  }
}

// --- consumer helpers ---
function getById(id) {
  return products.value.find(p => p.id === id) || null
}

export default {
  products,
  productsLoading,
  initialized,
  preFetchProducts,
  initFromSSR,
  fetchProductsIfNeeded,
  getById
}
