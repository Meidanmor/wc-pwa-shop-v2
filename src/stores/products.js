// src/stores/products.js
import { ref } from 'vue'
import api from 'src/boot/woocommerce'
import { isAdmin } from 'src/stores/user' // Our new lightweight store

 const Base =
  import.meta.env.SSR
    ? process.env.API_BASE
    : import.meta.env.API_BASE

// --- reactive state ---
const products = ref([])
const productsLoading = ref(false)
const initialized = ref(false)
let loadingPromise = null // The "Gatekeeper"
const SSR_KEY = '__PRODUCTS_DATA__'
export const totalProducts = ref(0)
export const totalPages = ref(1);
const categories = ref([]);
const priceMeta = ref(null);

async function getByIds(ids = []) {
  if (!Array.isArray(ids) || !ids.length) return []

  const masterMap = new Map(products.value.map(p => [p.id, p]))
  const existing = ids.map(id => masterMap.get(Number(id))).filter(Boolean)
  const missingIds = ids.filter(id => !masterMap.has(Number(id)))

  if (missingIds.length === 0) return existing

  try {
    // Parallel fetch for the missing items using the Store API endpoint
    const fetchPromises = missingIds.map(id =>
      fetch(`${import.meta.env.VITE_API_BASE}/wp-json/wc/store/v1/products/${id}`)
        .then(res => res.ok ? res.json() : null)
    )

    const fetchedMissing = (await Promise.all(fetchPromises)).filter(Boolean)

    // Merge into the Master List
    fetchedMissing.forEach(p => masterMap.set(p.id, p))
    products.value = Array.from(masterMap.values())

  } catch (err) {
    console.error('[products store] Store API getByIds failed', err)
  }

  return ids.map(id => masterMap.get(Number(id))).filter(Boolean)
}

// --- core fetchers ---
export async function preFetchProducts(ctx = {}, force = false) {
  // 🟢 NEW: detect if we are using API mode
  const isApiMode = typeof ctx === 'object' && ctx !== null && ctx.api === true;

  // =========================
  // 🟢 NEW API MODE (ProductsPage)
  // =========================
if (isApiMode) {
  try {

    if (!ctx.dryRun) {
      productsLoading.value = true
    }

    const {
      page = 1,
      per_page = 6,
      min_price,
      max_price,
      category,
      search,
      orderby,
      order
    } = ctx

    const query = new URLSearchParams()

    query.append('page', page)
    query.append('per_page', per_page)

    if (min_price !== undefined && !isNaN(min_price)) {
      query.append('min_price', Math.round(min_price))
    }

    if (max_price !== undefined && !isNaN(max_price)) {
      query.append('max_price', Math.round(max_price))
    }

    if (category) {
      query.append('category', category)
    }

    if (search) {
      query.append('search', search)
    }

    if (orderby && orderby !== 'menu_order') {
      query.append('orderby', orderby)
    }

    if (order) {
      query.append('order', order)
    }

    const url = `${import.meta.env.VITE_API_BASE}/wp-json/wc/store/v1/products?${query.toString()}`

    try {

      // =========================
      // PRIMARY: LIVE API
      // =========================

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()

      const total = res.headers.get('X-WP-Total')
      const totalPagesHeader = res.headers.get('X-WP-TotalPages')

      if (ctx.dryRun) {
        return {
          products: data || [],
          total: total ? parseInt(total) : 0,
          totalPages: totalPagesHeader ? parseInt(totalPagesHeader) : 1
        }
      }

      products.value = data || []
      totalProducts.value = total ? parseInt(total) : 0
      totalPages.value = totalPagesHeader ? parseInt(totalPagesHeader) : 1

      return products.value

    } catch (apiErr) {

      console.warn('[products] API failed, using offline fallback', apiErr)

      // =========================
      // FALLBACK: products.json
      // =========================

      let localProducts = []

      if (import.meta.env.DEV && import.meta.env.SSR) {

        const {readFile} = await import('fs/promises')
        const {resolve} = await import('path')

        const filePath = resolve(process.cwd(), 'public', 'data', 'products.json')

        console.log(`[SSR] Reading products from filesystem: ${filePath}`)

        const raw = await readFile(filePath, 'utf-8')

        localProducts = JSON.parse(raw)

      } else {

        let url

        if (import.meta.env.SSR) {
          url = `${Base}/data/products.json`
          console.log(`[SSR] Fetching products via HTTP: ${url}`)
        } else {
          url = '/data/products.json'
        }

        const localRes = await fetch(url)

        if (!localRes.ok) {
          throw new Error('products.json fallback failed')
        }

        localProducts = await localRes.json()
      }

      // -------------------------
      // LOCAL FILTERING
      // -------------------------

      if (category) {
        localProducts = localProducts.filter(p =>
            p.categories?.some(c => String(c.id) === String(category))
        )
      }

      if (search) {
        const term = search.toLowerCase()

        //const slug = p.permalink?.split('/').filter(Boolean).pop() || ''

        localProducts = localProducts.filter(p =>
            p.name?.toLowerCase().includes(term) || p.permalink?.split('/').filter(Boolean).pop()?.includes(term)
        )
      }

      if (min_price !== undefined) {
        console.log(min_price);
        localProducts = localProducts.filter(p => {
          const price = parseFloat(p.prices?.price || 0)
          console.log(price);
          return price >= min_price
        })
      }

      if (max_price !== undefined) {
        localProducts = localProducts.filter(p => {
          const price = parseFloat(p.prices?.price || 0)
          return price <= max_price
        })
      }

      // -------------------------
      // LOCAL SORTING
      // -------------------------

      if (orderby === 'price') {
        localProducts.sort((a, b) => {
          const aPrice = parseFloat(a.prices?.price || 0)
          const bPrice = parseFloat(b.prices?.price || 0)

          return order === 'desc'
              ? bPrice - aPrice
              : aPrice - bPrice
        })
      }

      // -------------------------
      // LOCAL PAGINATION
      // -------------------------

      const total = localProducts.length
      const pages = Math.ceil(total / per_page)

      const start = (page - 1) * per_page
      const end = start + per_page

      const paginated = localProducts.slice(start, end)

      if (ctx.dryRun) {
        return {
          products: paginated,
          total,
          totalPages: pages
        }
      }

      products.value = paginated
      totalProducts.value = total
      totalPages.value = pages

      return paginated
    }

  } catch (err) {

    console.error('[products store] catastrophic failure', err)

    // IMPORTANT:
    // preserve previous products instead of nuking UI

    return products.value || []

  } finally {
    productsLoading.value = false
  }
}

  // =========================
  // 🔵 ORIGINAL LOGIC (UNCHANGED)
  // =========================
if (import.meta.env.SSR) {

  try {

    productsLoading.value = true
    let allProducts = []

    const base =
      process.env.SERVER
        ? process.env.API_BASE   // your production domain
        : ''

    const url = `${base}/data/products.json`

    try {
      console.log(`[SSR] Fetching products via HTTP: ${url}`)

      const response = await fetch(url, {
        cache: 'no-store'
      })

      if (response.ok) {
        const raw = await response.text()

        if (raw.trim()) {
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

    if (!allProducts.length) {
      console.log('Fetching products from API...')
      allProducts = await api.getProducts()

      // ⛔ keep this block removed (fs no longer exists)
      // previously writing to file — no longer possible in SSR serverless
    }

    products.value = allProducts
    initialized.value = true

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
    initFromSSR()

    if (loadingPromise) {
      await loadingPromise
      return products.value
    }

    if (!initialized.value || force) {
      loadingPromise = (async () => {
        try {
          productsLoading.value = true
          const res = await fetch('/data/products.json')
          const data = await res.json()

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
  const isOffline =
  typeof navigator !== 'undefined' &&
  navigator.onLine === false

  if (isOffline) {
    console.log('fetching offline product');
    await preFetchProducts({search: slug})
  }
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

async function prefetchCategories() {
  const isOffline =
  typeof navigator !== 'undefined' &&
  navigator.onLine === false

  if (isOffline) {

    let localCategories = [];

    if (import.meta.env.DEV && import.meta.env.SSR) {

      const {readFile} = await import('fs/promises')
      const {resolve} = await import('path')

      const filePath = resolve(process.cwd(), 'public', 'data', 'categories.json')

      console.log(`[SSR] Reading categories from filesystem: ${filePath}`)

      const raw = await readFile(filePath, 'utf-8')

      localCategories = JSON.parse(raw)

    } else {

      let url

      if (import.meta.env.SSR) {
        url = `${Base}/data/categories.json`
        console.log(`[SSR] Fetching categories via HTTP: ${url}`)
      } else {
        url = '/data/categories.json'
      }

      const localRes = await fetch(url)

      if (!localRes.ok) {
        throw new Error('categories.json fallback failed')
      }

      localCategories = await localRes.json()
    }

    categories.value = localCategories;
  } else {
    categories.value = await api.getCategories()
  }

  return categories.value;
}

async function prefetchPriceMeta(cat=null) {

  const isOffline =
  typeof navigator !== 'undefined' &&
  navigator.onLine === false

  if (isOffline) {

    let localPriceMeta = [];

    if (import.meta.env.DEV && import.meta.env.SSR) {

      const {readFile} = await import('fs/promises')
      const {resolve} = await import('path')

      const filePath = resolve(process.cwd(), 'public', 'data', 'price-meta.json')

      console.log(`[SSR] Reading price-meta from filesystem: ${filePath}`)

      const raw = await readFile(filePath, 'utf-8')

      localPriceMeta = JSON.parse(raw)

    } else {

      let url

      if (import.meta.env.SSR) {
        url = `${Base}/data/price-meta.json`
        console.log(`[SSR] Fetching price-meta via HTTP: ${url}`)
      } else {
        url = '/data/price-meta.json'
      }

      const localRes = await fetch(url)

      if (!localRes.ok) {
        throw new Error('price-meta.json fallback failed')
      }

      localPriceMeta = await localRes.json()
    }

    if (!cat) {
      localPriceMeta = localPriceMeta?.global
    } else {
      localPriceMeta = localPriceMeta?.categories?.[cat]
    }

    priceMeta.value = localPriceMeta
  } else {
      let url = `${import.meta.env.VITE_API_BASE}/wp-json/wc/store/v1/products-meta`

    console.log('category is:', cat)
    if (cat) {
      url += `?category=${cat}`
    } else {
      cat = 'global';
    }

    const apiPriceMeta = await fetch(url);
    const jsonPriceMeta = await apiPriceMeta.json();
    priceMeta.value = jsonPriceMeta?.global ? jsonPriceMeta.global : jsonPriceMeta;
  }

  return priceMeta.value;
}

export default {
  products,
  categories,
  priceMeta,
  prefetchPriceMeta,
  prefetchCategories,
  productsLoading,
  initialized,
  preFetchProducts,
  initFromSSR,
  fetchProductsIfNeeded,
  getById,
  getByIds,
  fetchSingleProduct,
  totalProducts,
  totalPages
}
