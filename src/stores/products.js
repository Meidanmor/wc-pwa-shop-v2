// src/stores/products.js
import { ref } from 'vue'
import api from 'src/boot/woocommerce'
import path from 'path'
import fs from 'fs'

// --- reactive state ---
const products = ref([])
const productsLoading = ref(false)
const initialized = ref(false)

const SSR_KEY = '__PRE_FETCH_PRODUCTS__'

// --- core fetchers ---
export async function preFetchProducts(ctx, force=false) {
  if (import.meta.env.SSR) {

    try {
      productsLoading.value = true
      let allProducts = []

      const filePath = path.join(process.cwd(), 'public/data/products.json')

      // 1️⃣ Try reading local JSON safely
      try {
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, 'utf-8')
          if (raw.trim()) { // make sure it's not empty
            allProducts = JSON.parse(raw)
            if (Array.isArray(allProducts) && allProducts.length) {
              console.log('Products loaded from products.json')
              products.value = allProducts
              initialized.value = true
              return allProducts
            }
          }
        }
      } catch (err) {
        console.warn('Failed to read products.json, will fetch API', err)
      }

      // 2️⃣ Fallback: fetch WooCommerce API if JSON missing or empty
      if (!allProducts.length) {
        console.log('Fetching products from API...')
        allProducts = await api.getProducts()

        // ✅ Write products.json directly
        try {
          fs.mkdirSync(path.dirname(filePath), {recursive: true})
          fs.writeFileSync(filePath, JSON.stringify(allProducts, null, 2), 'utf-8')
          console.log('products.json updated on server.')
        } catch (err) {
          console.warn('Failed to update products.json', err)
        }
      }

      products.value = allProducts
      initialized.value = true

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
  } else {
    // CLIENT: do NOT fetch
    initFromSSR()

    if (!initialized.value || force == true) {
      // fallback only if SSR failed
      try {
        const productsRes = await fetch('/data/products.json').then(res => res.json());
        products.value = productsRes
        initialized.value = true
      } catch (err) {
        console.log(err)
      }
    }
  }
}

function initFromSSR() {
  if (initialized.value) return

  let pre = []

  // client hydration
  if (typeof window !== 'undefined') {
    pre = window.__PRODUCTS_DATA__ || []
  }

  if (Array.isArray(pre) && pre.length) {
    products.value = pre
    initialized.value = true
  }
}

async function fetchProductsIfNeeded(ctx) {
  if (initialized.value && products.value.length) return products.value

  // 1) SSR hydration
  initFromSSR()
  if (initialized.value && products.value.length) return products.value

  // 2) Fallback network
  await preFetchProducts(ctx)
  return products.value
}

// --- consumer helpers ---
async function fetchSingleProduct(slug) {
  // 1. Check if we already have it in the existing list
  const existing = products.value.find(p => {
    const pSlug = p.permalink?.split('/').filter(Boolean).pop()
    return pSlug === slug
  })

  if (existing) return existing

  // 2. If not, fetch it specifically from the API
  try {
    productsLoading.value = true
    // You'll need a method in your woocommerce boot file that calls
    // `wp-json/wc/v3/products?slug=...`
    const data = await api.getProductBySlug(slug)

    if (data) {
      // Add it to our local state so other components can use it
      products.value.push(data)
      return data
    }
  } catch (err) {
    console.error('Error fetching single product:', err)
  } finally {
    productsLoading.value = false
  }
  return null
}
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
  getById,
  fetchSingleProduct
}
