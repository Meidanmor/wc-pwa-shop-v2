// src/stores/cart.js
import { reactive, computed } from 'vue'
import { fetchWithToken } from 'src/composables/useApiFetch.js'
import productsStore from 'src/stores/products'

/* -------------------------
   Constants & state (same shape as before)
   ------------------------- */
const API_BASE = 'https://nuxt.meidanm.com/wp-json/wc/store'
const LOCAL_CART_KEY = 'local_cart_v1'
const LEGACY_OFFLINE_KEY = 'offline_cart'

const state = reactive({
  // server-side cart snapshot (informational only)
  cart_array: null,

  // authoritative local-only cart
  local_cart: { items: [] },

  // merged view used by UI (local-first): local items + API items that have no local override
  items: [],
  items_count: 0,

  totals: {},
  coupons: [],

  loading: { cart: false, quickbuy: false, wishlist: false },
  error: null,
  wishlist_items: {},
  user: {},
  offline: typeof navigator !== 'undefined' ? !navigator.onLine : true,
  drawerOpen: false
})

/* -------------------------
   Helpers (robust)
   ------------------------- */
function getMaxAllowed(item) {
  if (!item) return Infinity

  // 1. If quantity_limits.maximum exists (number)
  if (item.quantity_limits && typeof item.quantity_limits.maximum === 'number') {
    const m = item.quantity_limits.maximum
    return (m === null || Number.isNaN(m)) ? Infinity : m
  }

  // 2. Try add_to_cart.maximum
  if (item.add_to_cart && typeof item.add_to_cart.maximum === 'number') {
    const m = item.add_to_cart.maximum
    return (m === null || Number.isNaN(m)) ? Infinity : m
  }

  // 3. Try stock_availability.text (extract number)
  const stockText = item?.stock_availability?.text
  if (stockText && String(stockText).trim() !== '') {
    const m = String(stockText).match(/\d+/)
    if (m) return parseInt(m[0], 10)
  }

  return Infinity
}

async function getCachedProduct(productId) {
  // 1) Prefer in-memory global products store (fast, SSR hydrated if available)
  try {
    const fromStore = productsStore.getById(Number(productId))
    if (fromStore) return fromStore
  } catch (err) {
    console.error(err)
    // swallow
  }

  // 2) Try SW cache (the same cache / key used by products store)
  // NOTE: ensure these keys match products store SW cache keys
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('products-cache') // same name product store uses
      // the products store writes a synthetic key like '/api/products' (see earlier products.js)
      const matchKey = '/api/products'
      const res = await cache.match(matchKey)
      if (res && res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          const found = data.find(p => Number(p.id) === Number(productId))
          if (found) return found
        }
      }
    }
  } catch (err) {
    // ignore read/cache errors
    console.warn('[cart] getCachedProduct cache read failed', err)
  }

  // 3) As a last resort: ask the products store to fetch the listing if needed,
  //    (productsStore.fetchProductsIfNeeded will reuse SSR/cache and only hit network when needed)
  try {
    // Only fetch when online to avoid blocking while offline:
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      await productsStore.fetchProductsIfNeeded()
      const fromAfterFetch = productsStore.getById(Number(productId))
      if (fromAfterFetch) return fromAfterFetch
    }
  } catch (err) {
    console.warn('[cart]', err)
    // swallow
  }

  // Nothing found
  return null
}


function normalizeVariation(variation) {
  // Always return sorted array of { attribute, value }
  if (!variation) return []
  if (Array.isArray(variation)) {
    const mapped = variation.map(v => {
      if (!v) return { attribute: '', value: '' }
      if (typeof v === 'string') return { attribute: '', value: String(v) }
      const attribute = v.attribute ?? v.name ?? v.option ?? ''
      const value = v.value ?? v.option ?? ''
      return { attribute: String(attribute), value: String(value) }
    }).filter(v => v.attribute !== '' || v.value !== '')
    return mapped.sort((a, b) => (a.attribute + a.value).localeCompare(b.attribute + b.value))
  }
  if (typeof variation === 'object') {
    if ('attribute' in variation || 'value' in variation || 'name' in variation) {
      const attribute = variation.attribute ?? variation.name ?? ''
      const value = variation.value ?? variation.option ?? ''
      if (attribute === '' && (value === '' || typeof value === 'undefined')) return []
      return [{ attribute: String(attribute), value: String(value) }]
    }
    // treat as object map { attr: value }
    const arr = Object.entries(variation).map(([k, v]) => {
      const val = (v && typeof v === 'object' && 'value' in v) ? v.value : v
      return { attribute: String(k), value: String(val ?? '') }
    }).filter(v => v.attribute !== '' || v.value !== '')
    return arr.sort((a, b) => (a.attribute + a.value).localeCompare(b.attribute + b.value))
  }
  // scalar fallback
  return [{ attribute: '', value: String(variation) }]
}

function itemSignature(itemLike) {
  if (!itemLike) return '0::'
  const id = (typeof itemLike.id !== 'undefined' && itemLike.id !== null) ? String(itemLike.id) : '0'
  const variationArr = normalizeVariation(itemLike.variation)
  const varSig = variationArr
    .map(v => `${v.attribute || ''}:${v.value || ''}`)
    .filter(Boolean)
    .sort()
    .join('|')
  return `${id}::${varSig}`
}

function generateLocalKeyForSig(sig) {
  // deterministic short key based on signature (stable across reloads)
  let h = 5381
  for (let i = 0; i < sig.length; i++) h = ((h << 5) + h) + sig.charCodeAt(i)
  const num = (h >>> 0).toString(36)
  // include a short sanitized part of the signature for easier debugging
  const friendly = sig.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 18)
  return `local-${num}-${friendly}`
}

function buildLocalItemFromProduct(productLike, variation = [], quantity = 1) {
  const images = productLike?.images ?? []
  const prices = productLike?.prices ?? (productLike?.price ? { price: productLike.price, currency_code: (productLike?.prices?.currency_code || '') } : {})
  const normalizedVariation = normalizeVariation(variation)
  const temp = {
    id: productLike?.id || 0,
    name: productLike?.name || productLike?.title || '',
    quantity: quantity || 1,
    quantity_limits: { maximum: productLike?.add_to_cart?.maximum ?? null, minimum: productLike?.add_to_cart?.minimum ?? 1, multiple_of: productLike?.add_to_cart?.multiple_of ?? 1 },
    prices,
    images,
    variation: normalizedVariation,
    _local: true,
    _synced: false
  }
  const sig = itemSignature(temp)
  temp.key = generateLocalKeyForSig(sig)
  return temp
}

/* -------------------------
   Persistence
   ------------------------- */
function persistLocalCart() {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(state.local_cart.items || []))
    // keep legacy key for compatibility
    localStorage.setItem(LEGACY_OFFLINE_KEY, JSON.stringify(state.local_cart.items || []))
  } catch (err) {
    console.warn('[cart] persistLocalCart failed', err)
  }
}

async function loadLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY)
    let items = []
    if (raw) items = JSON.parse(raw) || []
    else {
      const legacy = localStorage.getItem(LEGACY_OFFLINE_KEY)
      if (legacy) items = JSON.parse(legacy) || []
    }

    // Normalize and dedupe by signature (sum quantities)
    const map = new Map()
    for (const it of items) {
      const normalized = {
        ...it,
        variation: normalizeVariation(it.variation || []),
        _local: it._local ?? true,
        _synced: it._synced ?? false,
        _removed: it._removed ?? false
      }
      const sig = itemSignature(normalized)
      if (map.has(sig)) {
        const existing = map.get(sig)
        existing.quantity = (existing.quantity || 0) + (normalized.quantity || 0)
        existing.name = existing.name || normalized.name
        existing.prices = existing.prices || normalized.prices
        existing.images = existing.images || normalized.images
      } else {
        normalized.key = normalized.key || generateLocalKeyForSig(sig)
        map.set(sig, normalized)
      }
    }

    state.local_cart.items = Array.from(map.values())
    persistLocalCart()
  } catch (err) {
    console.warn('[cart] loadLocalCart failed', err)
    state.local_cart.items = []
  }

  rebuildMergedView()
}

/* -------------------------
   rebuildMergedView (local-first)
   - local items are authoritative
   - include API items only if no local override exists
   ------------------------- */
function rebuildMergedView() {

  // mutate the same array instance so all refs/aliases stay reactive
  state.items.splice(0, state.items.length, ...(state.local_cart.items || []))

  // keep items_count as a number (recalculated here)
  state.items_count = state.items.reduce((s, i) => s + (i.quantity || 0), 0)

// totals: if server cart exists, use it; else compute minimal local total
  state.totals = state.cart_array?.totals || {
    total_items: String(state.items.reduce((s, it) =>
        s + ((it.prices?.price ? parseFloat(it.prices.price) * (it.quantity || 1) : 0)), 0))
  }
  state.coupons = state.cart_array?.coupons || []
  //console.log('cart merged', state);
}

/* -------------------------
   Background sync (local -> API) (does not overwrite local_cart)
   - attempts add/update/remove
   - after actions, fetch server cart into state.cart_array (informational)
   - mark local items _synced if found on server
   ------------------------- */
async function mergeLocalIntoApi($q = null) {
  if (!state.local_cart.items.length) return
  if (state.offline) return

  const apiItems = state.cart_array?.items || []
  const apiMap = new Map(apiItems.map(i => [itemSignature(i), i]))

  const actions = []
  for (const localItem of state.local_cart.items) {
    const sig = itemSignature(localItem)
    const apiItem = apiMap.get(sig)

    if (localItem._removed) {
      if (apiItem && apiItem.key) actions.push({ type: 'remove', payload: { key: apiItem.key }, sig })
      continue
    }

    // clamp quantity using API limits (if available)
    const maxAllowed = getMaxAllowed(apiItem || localItem)
    if (Number.isFinite(maxAllowed) && localItem.quantity > maxAllowed) localItem.quantity = maxAllowed

    if (apiItem) {
      if ((localItem.quantity || 0) !== (apiItem.quantity || 0)) {
        // update via api key
        if (apiItem.key) actions.push({ type: 'update', payload: { key: apiItem.key, quantity: localItem.quantity }, sig })
        else actions.push({ type: 'add', payload: { id: localItem.id, quantity: localItem.quantity, variation: localItem.variation }, sig })
      } else {
        // same quantity -> nothing to do, but will mark as synced after fetch
      }
    } else {
      // not on server -> add
      actions.push({ type: 'add', payload: { id: localItem.id, quantity: localItem.quantity, variation: localItem.variation }, sig })
    }
  }

  if (!actions.length) {
    // no actions, but refresh server snapshot
    try {
      const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        state.cart_array = data
        // mark synced local items
        const serverMap = new Map((state.cart_array.items || []).map(i => [itemSignature(i), i]))
        for (const li of state.local_cart.items) {
          const matching = serverMap.get(itemSignature(li))
          if (matching) {
            li._synced = true
            li.remote_key = matching.key || li.remote_key
          } else li._synced = false
        }
        persistLocalCart()
        rebuildMergedView()
      }
    } catch (err) {
      console.warn('[cart] merge refresh failed', err)
    }
    return
  }

  state.loading.cart = true
  for (const act of actions) {
    try {
      if (act.type === 'add') {
        const body = { id: act.payload.id, quantity: act.payload.quantity }
        if (act.payload.variation && act.payload.variation.length) {
          body.variation = act.payload.variation.map(v => ({ attribute: v.attribute, value: v.value }))
        }
        const res = await fetchWithToken(`${API_BASE}/cart/add-item`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.warn('[cart] merge add failed', err)
        }
      } else if (act.type === 'update') {
        const res = await fetchWithToken(`${API_BASE}/cart/update-item`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(act.payload)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.warn('[cart] merge update failed', err)
        }
      } else if (act.type === 'remove') {
        const res = await fetchWithToken(`${API_BASE}/cart/remove-item`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(act.payload)
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          console.warn('[cart] merge remove failed', err)
        }
      }
    } catch (err) {
      console.warn('[cart] merge action error', err)
    }
  }

  // Refresh server snapshot and mark local items as synced if present on server
  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
    if (res.ok) {
      const data = await res.json()
      state.cart_array = data
      const serverMap = new Map((state.cart_array.items || []).map(i => [itemSignature(i), i]))
      for (const li of state.local_cart.items) {
        const matching = serverMap.get(itemSignature(li))
        if (matching) {
          li._synced = true
          li.remote_key = matching.key || li.remote_key
        } else {
          li._synced = false
        }
      }
      persistLocalCart()
      rebuildMergedView()
      if ($q && $q.notify) $q.notify({ type: 'positive', message: 'Cart synced with server.', icon: 'cloud_done' })
    } else {
      console.warn('[cart] fetchCart after merge failed')
    }
  } catch (err) {
    console.warn('[cart] fetchCart after merge failed', err)
  } finally {
    state.loading.cart = false
  }
}

/* -------------------------
   API fetch/update functions
   ------------------------- */
async function updateCartState(data) {
  // Update server snapshot but do NOT let server override local items
  state.cart_array = data || null
  /*rebuildMergedView()
  persistLocalCart()*/
}

async function fetchCart() {
  // We still fetch the api cart to know server quantities/keys for syncing,
  // but we do not let it replace the local cart.
  if (state.offline) {
    loadLocalCart()
    state.cart_array = null
    rebuildMergedView()
    return
  }

  state.loading.cart = true
  state.error = null

  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to fetch cart')
    const data = await res.json()
    // store server snapshot only
    state.cart_array = data
    rebuildMergedView()
    // try to push local changes (background)
    mergeLocalIntoApi().catch(err => console.warn('[cart] mergeLocalIntoApi failed', err))
  } catch (err) {
    state.error = err.message
    loadLocalCart()
    state.cart_array = null
    rebuildMergedView()
  } finally {
    state.loading.cart = false
    state.loading.quickbuy = false
  }
}

/* -------------------------
   Public operations (keep same function signatures)
   - All operate local-first and persist locally
   ------------------------- */
async function add(productId, quantity = 1, variationId = null, variation = {}, $q = null) {
  state.loading.cart = true
  state.error = null

  const variationArr = normalizeVariation(variation)
  const sigCandidate = `${productId}::${variationArr.map(v => `${v.attribute || ''}:${v.value || ''}`).filter(Boolean).sort().join('|')}`

  // find local item by exact signature
  let localItem = state.local_cart.items.find(i => itemSignature(i) === sigCandidate)

  if (localItem) {
    const maxAllowed = getMaxAllowed(localItem)
    const current = localItem.quantity || 0
    const allowed = maxAllowed === Infinity ? Infinity : maxAllowed - current
    const addQty = Math.min(quantity, allowed)
    if (addQty <= 0) {
      if ($q) $q.notify({ type: 'negative', message: 'No more stock available', icon: 'error' })
      state.loading.cart = false
      return
    }
    localItem.quantity = current + addQty
    localItem._removed = false
    persistLocalCart()
    rebuildMergedView()
    if ($q) $q.notify({ type: 'positive', message: 'Added to cart', icon: 'shopping_cart' })
    state.loading.cart = false
    state.drawerOpen = true
    return
  }

  // Try to find an API item with this signature (to use product metadata)
  const apiItem = (state.cart_array?.items || []).find(i => itemSignature(i) === sigCandidate)

  if (apiItem) {
    const maxAllowed = getMaxAllowed(apiItem)
    const intendedQty = (apiItem.quantity || 0) + quantity
    const clampQty = maxAllowed === Infinity ? intendedQty : Math.min(intendedQty, maxAllowed)
    if (clampQty <= (apiItem.quantity || 0)) {
      if ($q) $q.notify({ type: 'negative', message: 'Only 0 more available for this product.', icon: 'error' })
      state.loading.cart = false
      return
    }
    const normalizedVariation = normalizeVariation(Array.isArray(apiItem.variation) ? apiItem.variation : variationArr)
    const clone = {
      id: apiItem.id,
      variationID: variationId || 0,
      name: apiItem.name || '',
      quantity: clampQty,
      prices: apiItem.prices || {},
      images: apiItem.images || [],
      variation: normalizedVariation,
      quantity_limits: apiItem.quantity_limits ? { ...apiItem.quantity_limits } : { editable: true, maximum: maxAllowed, minimum: 1, multiple_of: 1 },
      _local: true,
      _synced: false
    }
    const sig = itemSignature(clone)
    clone.key = generateLocalKeyForSig(sig)
    state.local_cart.items.push(clone)
    persistLocalCart()
    rebuildMergedView()
    if ($q) $q.notify({ type: 'positive', message: 'Added to cart', icon: 'shopping_cart' })
    state.loading.cart = false
    state.drawerOpen = true
    return
  }

  // fallback: create local-only item using cached product metadata if possible
  let productData = null
  try { productData = await getCachedProduct(productId) } catch (err) { console.error(err); productData = null }
  const sourceProduct = productData || { id: productId, name: '', images: [], prices: {}, add_to_cart: { minimum: 1, maximum: null }, stock_availability: { text: '' } }
  const localItemNew = buildLocalItemFromProduct(sourceProduct, variationArr, quantity)
  const maxAllowedNew = getMaxAllowed(localItemNew)
  if (maxAllowedNew !== Infinity && localItemNew.quantity > maxAllowedNew) {
    localItemNew.quantity = maxAllowedNew
    if ($q) $q.notify({ type: 'negative', message: `Only ${maxAllowedNew} available for this product`, icon: 'error' })
  }
  state.local_cart.items.push(localItemNew)
  persistLocalCart()
  rebuildMergedView()
  if ($q) $q.notify({ type: 'positive', message: 'Added to cart', icon: 'shopping_cart' })
  state.loading.cart = false
  state.drawerOpen = true
}

async function increase(productIdOrKey, $q = null) {
  // Prefer exact local item by key or signature, else match by id
  let localItem = null

  if (typeof productIdOrKey === 'string' && productIdOrKey.startsWith('local-')) {
    localItem = state.local_cart.items.find(i => i.key === productIdOrKey)
  } else {
    // try interpret as signature
    localItem = state.local_cart.items.find(i => itemSignature(i) === String(productIdOrKey))
    if (!localItem) {
      const idNum = Number(productIdOrKey)
      if (!Number.isNaN(idNum)) {
        // prefer no-variation local item for that id
        localItem = state.local_cart.items.find(i => Number(i.id) === idNum && normalizeVariation(i.variation).length === 0)
        if (!localItem) localItem = state.local_cart.items.find(i => Number(i.id) === idNum)
      }
    }
  }

  if (localItem) {
    const max = getMaxAllowed(localItem)
    if (max !== Infinity && (localItem.quantity || 0) >= max) {
      if ($q) $q.notify({ type: 'negative', message: `Reached max stock (${max}) for ${localItem.name || 'item'}`, icon: 'error' })
      return
    }
    localItem.quantity = (localItem.quantity || 0) + 1
    persistLocalCart()
    rebuildMergedView()
    if ($q) $q.notify({ type: 'info', message: 'Quantity updated', icon: 'shopping_cart' })
    return
  }

  // fallback: create minimal local item
  const minimal = { id: productIdOrKey, name: '', quantity: 1, prices: {}, images: [], variation: [], _local: true, _synced: false }
  const sig = itemSignature(minimal)
  minimal.key = generateLocalKeyForSig(sig)
  state.local_cart.items.push(minimal)
  persistLocalCart()
  rebuildMergedView()
  if ($q) $q.notify({ type: 'info', message: 'Quantity updated', icon: 'shopping_cart' })
}

async function decrease(cartItemKey, /*$q = null*/) {
  // exact local item by key OR signature
  const locIdx = state.local_cart.items.findIndex(i => i.key === cartItemKey || itemSignature(i) === cartItemKey)
  if (locIdx !== -1) {
    const item = state.local_cart.items[locIdx]
    item.quantity = (item.quantity || 0) - 1
    if (item.quantity <= 0) {
      state.local_cart.items.splice(locIdx, 1)
      const removalSig = `${item.id}::${normalizeVariation(item.variation).map(v => `${v.attribute}:${v.value}`).filter(Boolean).sort().join('|')}`
      const removal = { key: generateLocalKeyForSig(removalSig), id: item.id, quantity: 0, variation: normalizeVariation(item.variation || []), _local: true, _removed: true, _synced: false }
      state.local_cart.items.push(removal)
    }
    persistLocalCart()
    rebuildMergedView()
    return
  }

  // not local: try to find API item and create local override
  const apiItem = (state.cart_array?.items || []).find(i => i.key === cartItemKey || i.id === cartItemKey)
  if (apiItem) {
    const desired = (apiItem.quantity || 1) - 1
    if (desired <= 0) {
      const rm = { key: generateLocalKeyForSig(itemSignature(apiItem)), id: apiItem.id, quantity: 0, variation: normalizeVariation(apiItem.variation || []), _local: true, _removed: true, _synced: false }
      state.local_cart.items.push(rm)
    } else {
      const override = { key: generateLocalKeyForSig(itemSignature(apiItem)), id: apiItem.id, name: apiItem.name, quantity: desired, prices: apiItem.prices || {}, images: apiItem.images || [], variation: normalizeVariation(apiItem.variation || []), _local: true, _synced: false }
      override.quantity_limits = apiItem.quantity_limits ? { ...apiItem.quantity_limits } : { editable: true, maximum: getMaxAllowed(apiItem), minimum: 1, multiple_of: 1 }
      state.local_cart.items.push(override)
    }
    persistLocalCart()
    rebuildMergedView()
    return
  }

  // nothing matched
  return
}

async function remove(cartItemKey, $q = null) {
  state.loading.cart = true
  state.error = null

  // if local key exists -> remove locally
  const idxLocal = state.local_cart.items.findIndex(i => i.key === cartItemKey)
  if (idxLocal !== -1) {
    state.local_cart.items.splice(idxLocal, 1)
    persistLocalCart()
    rebuildMergedView()
    state.loading.cart = false
    if ($q) $q.notify({ type: 'positive', message: 'Removed from cart', icon: 'shopping_cart' })
    return
  }

  // try to find API item by key
  const apiItem = (state.cart_array?.items || []).find(i => i.key === cartItemKey)
  if (!apiItem || state.offline) {
    if (apiItem) {
      // mark removal override locally
      const rm = {
        key: generateLocalKeyForSig(itemSignature(apiItem)),
        id: apiItem.id,
        name: apiItem.name,
        quantity: 0,
        variation: normalizeVariation(apiItem.variation || []),
        _local: true,
        _removed: true,
        _synced: false
      }
      state.local_cart.items.push(rm)
      persistLocalCart()
      rebuildMergedView()
      state.loading.cart = false
      if ($q) $q.notify({ type: 'info', message: 'Removed from cart (local)', icon: 'cloud_off' })
      return
    } else {
      state.loading.cart = false
      return
    }
  }

  // online + apiItem present -> remove remotely and then update server snapshot
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-item`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cartItemKey })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error((data && data.message) || 'Failed to remove item')

    // remove any local items that match sig
    const sig = itemSignature(apiItem)
    state.local_cart.items = state.local_cart.items.filter(i => itemSignature(i) !== sig)

    // update server snapshot (no replace of local)
    await updateCartState(data)
    if ($q) $q.notify({ type: 'positive', message: 'Removed from cart.', icon: 'shopping_cart' })
  } catch (err) {
    state.error = err.message
    if ($q) $q.notify({ type: 'negative', message: 'Failed to remove.', icon: 'error' })
  } finally {
    persistLocalCart()
    rebuildMergedView()
    state.loading.cart = false
  }
}

async function clear() {
  state.loading.cart = true
  state.error = null
  state.local_cart.items = []
  persistLocalCart()
  rebuildMergedView()
  state.loading.cart = false
}

/* -------------------------
   Coupons / placeOrder
   ------------------------- */
async function applyCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/apply-coupon`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
    const data = await res.json()
    if (!res.ok) throw new Error('Coupon failed')
    // update server snapshot (informational)
    await updateCartState(data)
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function removeCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-coupon`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
    const data = await res.json()
    if (!res.ok) throw new Error('Coupon removal failed')
    await updateCartState(data)
  } catch (err) {
    console.error(err)
    throw err
  }
}

async function placeOrder(payload) {
  // ensure server reflects local cart before placing order
  await mergeLocalIntoApi()
  try {
    const res = await fetchWithToken(`${API_BASE}/checkout`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Checkout failed')
    return data
  } catch (err) {
    console.error('Checkout error:', err.message)
    throw err
  }
}

/* -------------------------
   Wishlist (kept behaviour, cleaned)
   ------------------------- */
function persistWLOffline() {
  try { localStorage.setItem('offline_wl', JSON.stringify(state.wishlist_items || [])) } catch (err) { console.warn('[cart] persistWLOffline failed', err) }
}
function loadOfflineWL() {
  try { const raw = localStorage.getItem('offline_wl'); if (raw) state.wishlist_items = JSON.parse(raw) } catch (err) { console.warn('[cart] loadOfflineWL failed', err) }
}

async function WLreplayOfflineItems(fetchedWL = { wishlist: [] }) {
  const offlineItems = state.wishlist_items || []
  const offlineIDs = Array.isArray(offlineItems) ? offlineItems.map(i => i?.id).filter(Boolean) : []
  const serverIDs = (fetchedWL?.wishlist || []).map(i => i?.id).filter(Boolean)

  for (const id of offlineIDs) {
    if (!serverIDs.includes(id)) {
      try {
        await fetchWithToken(`${API_BASE}/wishlist/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: id })
        })
      } catch (err) {
        console.warn('[WLreplayOfflineItems] error', err)
      }
    }
  }
}

async function fetchWishlistItems() {
  if (typeof window === 'undefined') return
  if (state.offline) { loadOfflineWL(); return }
  state.loading.wishlist = true
  try {
    const res = await fetchWithToken(`${API_BASE}/wishlist/`, { method: 'GET', credentials: 'include' })
    const wishlistItems = await res.json()
    // replay offline-only items into server
    await WLreplayOfflineItems(wishlistItems)
    // fetch again to ensure we have latest
    const res2 = await fetchWithToken(`${API_BASE}/wishlist/`, { method: 'GET', credentials: 'include' })
    const wishlistItems2 = await res2.json()
    state.wishlist_items = wishlistItems2.wishlist || wishlistItems2 || []
    persistWLOffline()
  } catch (err) {
    state.error = err.message
    loadOfflineWL()
  } finally {
    state.loading.wishlist = false
  }
}

async function toggleWishlistItem(productId, $q = null) {
  state.loading.wishlist = true
  if (state.offline) {
    try {
      // load product minimal info from cache or just toggle id
      const exists = Array.isArray(state.wishlist_items) && state.wishlist_items.find(p => p.id === productId)
      if (!state.wishlist_items || !Array.isArray(state.wishlist_items)) state.wishlist_items = []
      if (!exists) state.wishlist_items.push({ id: productId })
      else state.wishlist_items = state.wishlist_items.filter(p => p.id !== productId)
      persistWLOffline()
    } catch (err) { console.warn(err) } finally { state.loading.wishlist = false }
    return
  }
  try {
    const res = await fetchWithToken(`${API_BASE}/wishlist/`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: productId }) })
    const wishlistItems = await res.json()
    state.wishlist_items = wishlistItems.wishlist || wishlistItems || []
    if ($q && $q.notify) {
      //const oldCount = state.wishlist_items ? state.wishlist_items.length : 0
      $q.notify({ type: 'positive', message: 'Wishlist updated', icon: 'favorite' })
    }
    persistWLOffline()
  } catch (err) {
    state.error = err.message
  } finally { state.loading.wishlist = false }
}

/* -------------------------
   Init
   ------------------------- */
if (typeof window !== 'undefined') {
  loadLocalCart().then(() => rebuildMergedView());

  window.addEventListener('online', async () => {
    state.offline = false
    try {
      await fetchCart()
      await mergeLocalIntoApi()
    } catch (err) {
      console.warn('[cart] online sync failed', err)
    }
  })

  window.addEventListener('offline', () => {
    state.offline = true
  })
}

const hasItems = computed(() => state.items.length > 0)

/* -------------------------
   Exports (preserve previous API)
   ------------------------- */
export default {
  state,
  hasItems,
  add,
  increase,
  decrease,
  remove,
  clear,
  fetchCart,
  applyCoupon,
  removeCoupon,
  placeOrder,
  toggleWishlistItem,
  fetchWishlistItems,
  signatureFor(productId, variationArray) {
    const varArr = Array.isArray(variationArray) ? variationArray : normalizeVariation(variationArray)
    const varSig = varArr.map(v => `${v.attribute || ''}:${v.value || ''}`).filter(Boolean).sort().join('|')
    return `${productId}::${varSig}`
  }
}
