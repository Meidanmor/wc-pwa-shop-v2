// src/stores/products.js
import { ref } from 'vue'
import api from 'src/boot/woocommerce'
import path from 'path'
import fs from 'fs'
import { isAdmin } from 'src/stores/user' // Our new lightweight store

// --- reactive state ---
const products = ref([])
const productsLoading = ref(false)
const initialized = ref(false)
let loadingPromise = null // The "Gatekeeper"
const SSR_KEY = '__PRODUCTS_DATA__'

function getByIds(ids = []) {
  if (!Array.isArray(ids) || !ids.length) return []

  const map = new Map(products.value.map(p => [p.id, p]))

  return ids
    .map(id => map.get(Number(id))) // ✅ FIX
    .filter(Boolean)
}

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

    // 1. If a fetch is already in flight, don't start a new one.
    // This solves the 4x fetch problem.
    if (loadingPromise) {
      await loadingPromise
      return products.value
    }
    // 2. Only fetch if we aren't initialized OR we are forced
    if (!initialized.value || force) {
      loadingPromise = (async () => {
        try {
          productsLoading.value = true
          const res = await fetch('/data/products.json')
          const data = await res.json()

          // Ensure JSON products have a date for sorting
          const normalizedData = data.map(p => ({
            ...p,
            date_created: p.date_created || new Date(0).toISOString()
          }))

          const currentList = Array.isArray(products.value) ? products.value : []
          const productsMap = new Map(currentList.map(p => [p?.id, p]))
          normalizedData.forEach(p => productsMap.set(p.id, p))

          products.value = Array.from(productsMap.values())
          initialized.value = true

          if (isAdmin.value) {
            await fetchAdminDrafts()
          }

          return products.value
        } catch (err) {
          console.error('Client fetch failed', err)
          return products.value || []
        } finally {
          productsLoading.value = false
          loadingPromise = null
        }
      })()

      return loadingPromise
    }

    return Array.isArray(products.value) ? products.value : []
  }
}

// --- The New Helper ---
async function fetchAdminDrafts() {
  try {
    const allAdminProducts = await api.getAdminProducts()
    if (Array.isArray(allAdminProducts)) {
      const productsMap = new Map(products.value.map(p => [p.id, p]))

      allAdminProducts.forEach(item => {
        // 🟢 NORMALIZE DATE: Store API uses 'date_created', v3 uses 'date_created' or 'date_created_gmt'
        // We ensure a standard Date object can be created from it
        item.date_created = item.date_created_gmt || item.date_created || new Date().toISOString();

        // Store API uses 'is_in_stock' (boolean), REST API uses 'stock_status' (string)

        if (item.is_in_stock === undefined) {
          item.is_in_stock = item.stock_status === 'instock';
        }

        // ... your existing price normalization logic ...
        const normalizedPrice = item.price ? (parseFloat(item.price) * 100).toString() : '0';
        if (!item.prices) {
          item.prices = {
            price: normalizedPrice,
            regular_price: normalizedPrice,
            sale_price: normalizedPrice,
            price_range: null
          };
        }
        // If no slug exists, or it's a draft, use the ID-based structure
        if (!item.slug || item.status === 'draft') {
          item.permalink = `/product/id-${item.id}`;
        }
        productsMap.set(item.id, item)
      })

// 2. Sort with a more explicit numeric comparison
      const sortedArray = Array.from(productsMap.values()).sort((a, b) => {
        const timeA = new Date(a.date_created || 0).getTime()
        const timeB = new Date(b.date_created || 0).getTime()
        return timeB - timeA
      })

      products.value = sortedArray;
    }
  } catch (err) {
    console.warn('Admin fetch failed', err)
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
  getByIds,
  fetchSingleProduct
}
