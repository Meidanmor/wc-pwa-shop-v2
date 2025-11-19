// src/stores/products.js
import { ref } from 'vue'
import { useSSRContext } from 'vue'
import api from 'src/boot/woocommerce'
import path from 'path'
import fs from 'fs'

// --- reactive state ---
const products = ref([])
const productsLoading = ref(false)
const initialized = ref(false)

const SSR_KEY = '__PRE_FETCH_PRODUCTS__'

// --- core fetchers ---
async function preFetchProducts(ctx) {
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
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
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
}

function initFromSSR() {
  if (initialized.value) return

  let pre = []
  if (import.meta.env.SSR) {
    try {
      const ssr = useSSRContext()
      pre = ssr?.[SSR_KEY] || []
    } catch (err) {
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
