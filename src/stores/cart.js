import { reactive, computed } from 'vue'
import { fetchWithToken } from 'src/composables/useApiFetch.js'
import productsStore from 'src/stores/products'
import { matShoppingCart, matError, matCloudOff } from '@quasar/extras/material-icons'
import { userState, setUser } from 'src/stores/user'

/* -------------------------
   Constants
   ------------------------- */
const API_BASE = import.meta.env.VITE_STORE_API_BASE
const LOCAL_CART_KEY = 'local_cart_v1'
const LEGACY_OFFLINE_KEY = 'offline_cart'
const DEBUG = import.meta.env.DEV

/* -------------------------
   State
   ------------------------- */
const state = reactive({
  cart_array: null,
  local_cart: { items: [] },
  items: [],
  items_count: 0,
  totals: {},
  coupons: [],
  loading: { cart: false, quickbuy: false },
  error: null,
  offline: typeof window !== 'undefined' ? !navigator.onLine : false,
  drawerOpen: false,
  synced: false,
  get user() { return userState.data },
  set user(val) { setUser(val) }
})

/* -------------------------
   Tiny helpers
   ------------------------- */
function notifyUser($q, type, message, icon) {
  if ($q?.notify) $q.notify({ type, message, icon })
}

function markCartChanged() {
  state.synced = false
}

/* -------------------------
   Signature / key utilities
   ------------------------- */
function normalizeVariation(variation) {
  if (!variation) return []
  if (Array.isArray(variation)) {
    return variation
      .map(v => {
        if (!v) return { attribute: '', value: '' }
        if (typeof v === 'string') return { attribute: '', value: String(v) }
        const attribute = v.attribute ?? v.name ?? v.option ?? ''
        const value = v.value ?? v.option ?? ''
        return { attribute: String(attribute), value: String(value) }
      })
      .filter(v => v.attribute !== '' || v.value !== '')
      .sort((a, b) => (a.attribute + a.value).localeCompare(b.attribute + b.value))
  }
  if (typeof variation === 'object') {
    if ('attribute' in variation || 'value' in variation || 'name' in variation) {
      const attribute = variation.attribute ?? variation.name ?? ''
      const value = variation.value ?? variation.option ?? ''
      if (attribute === '' && (value === '' || typeof value === 'undefined')) return []
      return [{ attribute: String(attribute), value: String(value) }]
    }
    return Object.entries(variation)
      .map(([k, v]) => {
        const val = (v && typeof v === 'object' && 'value' in v) ? v.value : v
        return { attribute: String(k), value: String(val ?? '') }
      })
      .filter(v => v.attribute !== '' || v.value !== '')
      .sort((a, b) => (a.attribute + a.value).localeCompare(b.attribute + b.value))
  }
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

function buildSig(productId, variationArr) {
  const varSig = variationArr
    .map(v => `${v.attribute || ''}:${v.value || ''}`)
    .filter(Boolean)
    .sort()
    .join('|')
  return `${productId}::${varSig}`
}

function generateLocalKeyForSig(sig) {
  let h = 5381
  for (let i = 0; i < sig.length; i++) h = ((h << 5) + h) + sig.charCodeAt(i)
  const num = (h >>> 0).toString(36)
  const friendly = sig.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 18)
  return `local-${num}-${friendly}`
}

/* -------------------------
   Stock / limits helper
   ------------------------- */
function getMaxAllowed(item) {
  if (!item) return Infinity

  if (item.quantity_limits && typeof item.quantity_limits.maximum === 'number') {
    const m = item.quantity_limits.maximum
    return (m === null || Number.isNaN(m)) ? Infinity : m
  }
  if (item.add_to_cart && typeof item.add_to_cart.maximum === 'number') {
    const m = item.add_to_cart.maximum
    return (m === null || Number.isNaN(m)) ? Infinity : m
  }
  const stockText = item?.stock_availability?.text
  if (stockText && String(stockText).trim() !== '') {
    const m = String(stockText).match(/\d+/)
    if (m) return parseInt(m[0], 10)
  }
  return Infinity
}

/* -------------------------
   Product cache lookup
   ------------------------- */
async function getCachedProduct(productId) {
  try {
    const fromStore = productsStore.getById(Number(productId))
    if (fromStore) return fromStore
  } catch (err) {
    if (DEBUG) console.warn('[cart] getCachedProduct store lookup failed', err)
  }

  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await caches.open('products-cache')
      const res = await cache.match('/api/products')
      if (res?.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          const found = data.find(p => Number(p.id) === Number(productId))
          if (found) return found
        }
      }
    }
  } catch (err) {
    if (DEBUG) console.warn('[cart] getCachedProduct cache read failed', err)
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      await productsStore.fetchProductsIfNeeded()
      const fromAfterFetch = productsStore.getById(Number(productId))
      if (fromAfterFetch) return fromAfterFetch
    }
  } catch (err) {
    if (DEBUG) console.warn('[cart] getCachedProduct fetch failed', err)
  }

  return null
}

let productsJsonCache = null
async function getProductFromJson(productId) {
  try {
    if (!productsJsonCache) {
      const res = await fetch('/data/products.json')
      productsJsonCache = await res.json()
      if (!Array.isArray(productsJsonCache)) productsJsonCache = []
    }
    return productsJsonCache.find(p => Number(p.id) === Number(productId)) || null
  } catch (err) {
    if (DEBUG) console.warn('[cart] getProductFromJson failed', err)
    return null
  }
}

/* -------------------------
   Local item builder
   ------------------------- */
function buildLocalItemFromProduct(productLike, variation = [], quantity = 1) {
  const images = productLike?.images ?? []
  const prices = productLike?.prices ?? (productLike?.price
    ? { price: productLike.price, currency_code: productLike?.prices?.currency_code || '' }
    : {})
  const normalizedVariation = normalizeVariation(variation)
  const temp = {
    id: productLike?.id || 0,
    name: productLike?.name || productLike?.title || '',
    quantity: quantity || 1,
    quantity_limits: {
      maximum: productLike?.add_to_cart?.maximum ?? null,
      minimum: productLike?.add_to_cart?.minimum ?? 1,
      multiple_of: productLike?.add_to_cart?.multiple_of ?? 1
    },
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
    const data = JSON.stringify(state.local_cart.items || [])
    localStorage.setItem(LOCAL_CART_KEY, data)
    localStorage.setItem(LEGACY_OFFLINE_KEY, data) // legacy compat
  } catch (err) {
    if (DEBUG) console.warn('[cart] persistLocalCart failed', err)
  }
}

async function loadLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY)
    let items = []
    if (raw) {
      items = JSON.parse(raw) || []
    } else {
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
    if (DEBUG) console.warn('[cart] loadLocalCart failed', err)
    state.local_cart.items = []
  }

  rebuildMergedView()
}

/* -------------------------
   Merged view (local-first)
   BUG FIX: filter out _removed tombstones before rendering
   ------------------------- */
function rebuildMergedView() {
  const visible = (state.local_cart.items || []).filter(i => !i._removed)
  state.items.splice(0, state.items.length, ...visible)
  state.items_count = state.items.reduce((s, i) => s + (i.quantity || 0), 0)
  state.totals = state.cart_array?.totals || {
    total_items: String(
      state.items.reduce((s, it) =>
        s + (it.prices?.price ? parseFloat(it.prices.price) * (it.quantity || 1) : 0), 0)
    )
  }
  state.coupons = state.cart_array?.coupons || []
}

/* -------------------------
   applyServerSnapshot
   Single helper that replaces 4 duplicated update blocks
   ------------------------- */
function applyServerSnapshot(data) {
  state.cart_array = data || null
  state.synced = true
  state.error = null

  const serverMap = new Map(
    (state.cart_array?.items || []).map(i => [itemSignature(i), i])
  )
  for (const li of state.local_cart.items) {
    const match = serverMap.get(itemSignature(li))
    if (match) {
      li._synced = true
      li.remote_key = match.key || li.remote_key
    } else {
      li._synced = false
    }
  }

  persistLocalCart()
  rebuildMergedView()
}

/* -------------------------
   Signature equality check
   ------------------------- */
function localAndServerSignaturesEqual() {
  const local = (state.local_cart.items || [])
    .filter(i => !i._removed)
    .map(i => itemSignature(i))
    .sort()
    .join('|')

  const server = ((state.cart_array && state.cart_array.items) || [])
    .map(i => itemSignature(i))
    .sort()
    .join('|')

  return local === server
}

const needsSyncComputed = computed(() => {
  if (state.offline) return false
  if (state.synced === false) return true
  return !localAndServerSignaturesEqual()
})

/* -------------------------
   Debounced sync scheduler
   ------------------------- */
let __syncDebounceTimer = null
const SYNC_DEBOUNCE_MS = 700

function scheduleSyncLocalToServer() {
  if (__syncDebounceTimer) clearTimeout(__syncDebounceTimer)
  __syncDebounceTimer = setTimeout(() => {
    syncLocalCartWithServer().catch(err => {
      if (DEBUG) console.warn('[cart] scheduled sync failed', err)
    })
    __syncDebounceTimer = null
  }, SYNC_DEBOUNCE_MS)
}

/* -------------------------
   Item-by-item merge (FALLBACK ONLY)
   Only called by syncLocalCartWithServer when the batch endpoint fails.
   ------------------------- */
async function _mergeLocalIntoApiFallback() {
  if (!state.local_cart.items.length || state.offline) return

  const apiItems = state.cart_array?.items || []
  const apiMap = new Map(apiItems.map(i => [itemSignature(i), i]))

  const actions = []
  for (const localItem of state.local_cart.items) {
    const sig = itemSignature(localItem)
    const apiItem = apiMap.get(sig)

    if (localItem._removed) {
      if (apiItem?.key) actions.push({ type: 'remove', payload: { key: apiItem.key } })
      continue
    }

    const maxAllowed = getMaxAllowed(apiItem || localItem)
    if (Number.isFinite(maxAllowed) && localItem.quantity > maxAllowed) {
      localItem.quantity = maxAllowed
    }

    if (apiItem) {
      if ((localItem.quantity || 0) !== (apiItem.quantity || 0)) {
        if (apiItem.key) {
          actions.push({ type: 'update', payload: { key: apiItem.key, quantity: Number(localItem.quantity) } })
        } else {
          actions.push({ type: 'add', payload: { id: localItem.id, quantity: localItem.quantity, variation: localItem.variation } })
        }
      }
    } else {
      actions.push({ type: 'add', payload: { id: localItem.id, quantity: localItem.quantity, variation: localItem.variation } })
    }
  }

  // If no diff, just refresh the server snapshot
  if (!actions.length) {
    try {
      const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
      if (res.ok) applyServerSnapshot(await res.json())
    } catch (err) {
      if (DEBUG) console.warn('[cart] fallback refresh failed', err)
    }
    return
  }

  state.loading.cart = true
  for (const act of actions) {
    try {
      const endpoint =
        act.type === 'add'    ? 'add-item' :
        act.type === 'update' ? 'update-item' : 'remove-item'

      let body = act.payload
      if (act.type === 'add' && body.variation?.length) {
        body = { ...body, variation: body.variation.map(v => ({ attribute: v.attribute, value: v.value })) }
      }

      const res = await fetchWithToken(`${API_BASE}/cart/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (DEBUG) console.warn(`[cart] fallback ${act.type} failed`, err)
      }
    } catch (err) {
      if (DEBUG) console.warn('[cart] fallback action error', err)
    }
  }

  // Refresh server snapshot after all actions
  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
    if (res.ok) applyServerSnapshot(await res.json())
  } catch (err) {
    if (DEBUG) console.warn('[cart] fallback final refresh failed', err)
  } finally {
    state.loading.cart = false
  }
}

/* -------------------------
   PRIMARY SYNC
   Batch POST first, item-by-item as fallback
   ------------------------- */
async function syncLocalCartWithServer() {
  if (state.offline) return state.cart_array || null

  if (state.synced === true) {
    try {
      if (localAndServerSignaturesEqual()) return state.cart_array || null
    } catch (err) {
      if (DEBUG) console.warn('[cart] signature compare failed, proceeding to sync', err)
    }
  }

  state.loading.cart = true
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/sync-local-cart`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: state.local_cart.items,
        coupons: state.coupons.map(c => c.code)
      })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Batch sync failed')

    applyServerSnapshot(data)
    return data
  } catch (batchErr) {
    if (DEBUG) console.warn('[cart] batch sync failed, falling back to item-by-item', batchErr)
    state.error = batchErr.message || String(batchErr)
    state.synced = false
    // Fallback: item-by-item merge
    try {
      await _mergeLocalIntoApiFallback()
    } catch (fallbackErr) {
      if (DEBUG) console.warn('[cart] fallback sync also failed', fallbackErr)
    }
    throw batchErr
  } finally {
    state.loading.cart = false
  }
}

/* -------------------------
   fetchCartOnce (deduped)
   ------------------------- */
let cartFetchPromise = null

async function fetchCartOnce(forceSync = false) {
  if (cartFetchPromise) return cartFetchPromise

  cartFetchPromise = (async () => {
    try {
      loadLocalCart()
      if (state.offline) return state.cart_array

      if (forceSync || needsSyncComputed.value) {
        return await syncLocalCartWithServer()
      } else {
        return await fetchCart()
      }
    } finally {
      cartFetchPromise = null
    }
  })()

  return cartFetchPromise
}

/* -------------------------
   fetchCart
   ------------------------- */
async function fetchCart(force = false) {
  if (state.synced && !force) return
  if (DEBUG) console.log('[cart] fetchCart called')

  if (state.offline) {
    loadLocalCart()
    state.cart_array = null
    rebuildMergedView()
    return
  }

  state.error = null
  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to fetch cart')
    const data = await res.json()

    const cartToken = res.headers.get('Cart-Token') || null
    if (cartToken) {
      if (DEBUG) console.log('[cart] Cart-Token received:', cartToken)
      localStorage.setItem('wc_cart_token', cartToken)
    }

    state.cart_array = data
    rebuildMergedView()

    // Push any local changes to server (background unless forced)
    if (force) {
      await _mergeLocalIntoApiFallback()
    } else {
      _mergeLocalIntoApiFallback().catch(err => {
        if (DEBUG) console.warn('[cart] background merge failed', err)
      })
    }
  } catch (err) {
    state.error = err.message
    loadLocalCart()
    state.cart_array = null
    rebuildMergedView()
    state.synced = false
  } finally {
    state.loading.cart = false
    state.loading.quickbuy = false
  }
}

/* -------------------------
   add() sub-functions
   ------------------------- */
function _finishAdd($q, openDrawer = true) {
  persistLocalCart()
  rebuildMergedView()
  scheduleSyncLocalToServer()
  notifyUser($q, 'positive', 'Added to cart', matShoppingCart)
  state.loading.cart = false
  if (openDrawer) state.drawerOpen = true
}

function _addToExistingLocalItem(localItem, quantity, $q, openDrawer = true) {
  const maxAllowed = getMaxAllowed(localItem)
  const current = localItem.quantity || 0
  const addQty = maxAllowed === Infinity ? quantity : Math.min(quantity, maxAllowed - current)

  if (addQty <= 0) {
    notifyUser($q, 'negative', 'No more stock available', matError)
    state.loading.cart = false
    return
  }

  localItem.quantity = current + addQty
  localItem._removed = false
  _finishAdd($q, openDrawer)
}

function _addFromApiItem(apiItem, quantity, variationArr, variationId, $q, openDrawer = true) {
  const maxAllowed = getMaxAllowed(apiItem)
  const existingItem = state.local_cart.items.find(
    i => itemSignature(i) === itemSignature(apiItem) && !i._removed
  )
  const currentQty = existingItem ? (existingItem.quantity || 0) : 0
  const intendedQty = currentQty + quantity
  const clampQty = maxAllowed === Infinity ? intendedQty : Math.min(intendedQty, maxAllowed)

  if (clampQty <= (apiItem.quantity || 0)) {
    notifyUser($q, 'negative', 'Only 0 more available for this product.', matError)
    state.loading.cart = false
    return
  }

  const normalizedVariation = normalizeVariation(
    Array.isArray(apiItem.variation) ? apiItem.variation : variationArr
  )
  const clone = {
    id: apiItem.id,
    variationID: variationId || 0,
    name: apiItem.name || '',
    quantity: clampQty,
    prices: apiItem.prices || {},
    images: apiItem.images || [],
    variation: normalizedVariation,
    quantity_limits: apiItem.quantity_limits
      ? { ...apiItem.quantity_limits }
      : { editable: true, maximum: maxAllowed, minimum: 1, multiple_of: 1 },
    _local: true,
    _synced: false
  }
  clone.key = generateLocalKeyForSig(itemSignature(clone))
  state.local_cart.items.push(clone)
  _finishAdd($q, openDrawer)
}

async function _addNewItem(productId, quantity, variationArr, productDataFromUI, $q, openDrawer = true) {
  let productData = productDataFromUI
  if (!productData) {
    try { productData = await getCachedProduct(productId) } catch { productData = null }
  }
  if (!productData) productData = await getProductFromJson(productId)

  const sourceProduct = productData || {
    id: productId, name: '', images: [], prices: {},
    add_to_cart: { minimum: 1, maximum: null },
    stock_availability: { text: '' }
  }

  const localItemNew = buildLocalItemFromProduct(sourceProduct, variationArr, quantity)
  const maxAllowedNew = getMaxAllowed(localItemNew)
  if (maxAllowedNew !== Infinity && localItemNew.quantity > maxAllowedNew) {
    localItemNew.quantity = maxAllowedNew
    notifyUser($q, 'negative', `Only ${maxAllowedNew} available for this product`, matError)
  }

  state.local_cart.items.push(localItemNew)
  _finishAdd($q, openDrawer)
}

/* -------------------------
   Public cart mutations
   ------------------------- */
async function add(productId, quantity = 1, _variationId = null, variation = {}, $q = null, productDataFromUI = null, openDrawer = true) {
  markCartChanged()
  state.loading.cart = true
  state.error = null

  const variationArr = normalizeVariation(variation)
  const sig = buildSig(productId, variationArr)

  const localItem = state.local_cart.items.find(i => itemSignature(i) === sig)
  if (localItem) return _addToExistingLocalItem(localItem, quantity, $q, openDrawer)

  const apiItem = (state.cart_array?.items || []).find(i => itemSignature(i) === sig)
  if (apiItem) return _addFromApiItem(apiItem, quantity, variationArr, _variationId, $q, openDrawer)

  return _addNewItem(productId, quantity, variationArr, productDataFromUI, $q, openDrawer)
}

async function increase(productIdOrKey, $q = null) {
  markCartChanged()
  let localItem = null

  if (typeof productIdOrKey === 'string' && productIdOrKey.startsWith('local-')) {
    localItem = state.local_cart.items.find(i => i.key === productIdOrKey)
  } else {
    localItem = state.local_cart.items.find(i => itemSignature(i) === String(productIdOrKey))
    if (!localItem) {
      const idNum = Number(productIdOrKey)
      if (!Number.isNaN(idNum)) {
        localItem =
          state.local_cart.items.find(i => Number(i.id) === idNum && normalizeVariation(i.variation).length === 0) ||
          state.local_cart.items.find(i => Number(i.id) === idNum)
      }
    }
  }

  if (localItem) {
    const max = getMaxAllowed(localItem)
    if (max !== Infinity && (localItem.quantity || 0) >= max) {
      notifyUser($q, 'negative', `Reached max stock (${max}) for ${localItem.name || 'item'}`, matError)
      return
    }
    localItem.quantity = Number(localItem.quantity || 0) + 1
    persistLocalCart()
    rebuildMergedView()
    scheduleSyncLocalToServer()
    notifyUser($q, 'info', 'Quantity updated', matShoppingCart)
    return
  }

  // Fallback: create minimal local item
  const minimal = {
    id: productIdOrKey, name: '', quantity: 1,
    prices: {}, images: [], variation: [], _local: true, _synced: false
  }
  const sig = itemSignature(minimal)
  minimal.key = generateLocalKeyForSig(sig)
  state.local_cart.items.push(minimal)
  persistLocalCart()
  rebuildMergedView()
  scheduleSyncLocalToServer()
  notifyUser($q, 'info', 'Quantity updated', matShoppingCart)
}

async function decrease(cartItemKey) {
  markCartChanged()

  const locIdx = state.local_cart.items.findIndex(
    i => i.key === cartItemKey || itemSignature(i) === cartItemKey
  )

  if (locIdx !== -1) {
    const item = state.local_cart.items[locIdx]
    item.quantity = (item.quantity || 0) - 1

    if (item.quantity <= 0) {
      state.local_cart.items.splice(locIdx, 1)
      const removalSig = itemSignature(item)
      const removal = {
        key: generateLocalKeyForSig(removalSig),
        id: item.id,
        quantity: 0,
        variation: normalizeVariation(item.variation || []),
        _local: true,
        _removed: true,
        _synced: false
      }
      state.local_cart.items.push(removal)
    }

    persistLocalCart()
    rebuildMergedView()
    scheduleSyncLocalToServer()
    return
  }

  // Not local: create a local override from the API item
  const apiItem = (state.cart_array?.items || []).find(
    i => i.key === cartItemKey || i.id === cartItemKey
  )
  if (!apiItem) return

  const desired = (apiItem.quantity || 1) - 1
  if (desired <= 0) {
    const rm = {
      key: generateLocalKeyForSig(itemSignature(apiItem)),
      id: apiItem.id,
      quantity: 0,
      variation: normalizeVariation(apiItem.variation || []),
      _local: true,
      _removed: true,
      _synced: false
    }
    state.local_cart.items.push(rm)
  } else {
    const override = {
      key: generateLocalKeyForSig(itemSignature(apiItem)),
      id: apiItem.id,
      name: apiItem.name,
      quantity: desired,
      prices: apiItem.prices || {},
      images: apiItem.images || [],
      variation: normalizeVariation(apiItem.variation || []),
      quantity_limits: apiItem.quantity_limits
        ? { ...apiItem.quantity_limits }
        : { editable: true, maximum: getMaxAllowed(apiItem), minimum: 1, multiple_of: 1 },
      _local: true,
      _synced: false
    }
    state.local_cart.items.push(override)
  }

  persistLocalCart()
  rebuildMergedView()
  scheduleSyncLocalToServer()
}

async function remove(cartItemKey = null, cartItemAPIKey = null, $q = null) {
  markCartChanged()
  state.loading.cart = true
  state.error = null

  // Local item → remove directly
  const idxLocal = state.local_cart.items.findIndex(i => i.key === cartItemKey)
  if (idxLocal !== -1) {
    state.local_cart.items.splice(idxLocal, 1)
    persistLocalCart()
    rebuildMergedView()
    state.loading.cart = false
    notifyUser($q, 'positive', 'Removed from cart', matShoppingCart)
    if (!state.offline) scheduleSyncLocalToServer()
    return
  }

  // API item while offline → create local removal tombstone
  const apiItem = (state.cart_array?.items || []).find(i => i.remote_key === cartItemAPIKey)
  if (!apiItem || state.offline) {
    if (apiItem) {
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
      notifyUser($q, 'info', 'Removed from cart (local)', matCloudOff)
      if (!state.offline) scheduleSyncLocalToServer()
    }
    state.loading.cart = false
    return
  }

  // Online + API item → remove on server
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-item`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: cartItemAPIKey })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error((data && data.message) || 'Failed to remove item')

    // Remove matching local items
    const sig = itemSignature(apiItem)
    state.local_cart.items = state.local_cart.items.filter(i => itemSignature(i) !== sig)

    applyServerSnapshot(data)
    notifyUser($q, 'positive', 'Removed from cart.', matShoppingCart)
  } catch (err) {
    state.error = err.message
    notifyUser($q, 'negative', 'Failed to remove.', matError)
    if (!state.offline) scheduleSyncLocalToServer()
  } finally {
    state.loading.cart = false
  }
}

async function clear() {
  markCartChanged()
  state.loading.cart = true
  state.error = null
  state.local_cart.items = []
  persistLocalCart()
  rebuildMergedView()
  scheduleSyncLocalToServer()
  state.loading.cart = false
}

/* -------------------------
   Coupons
   ------------------------- */
async function applyCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/apply-coupon`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (!res.ok) throw new Error('Coupon failed')
    state.cart_array = data || null
  } catch (err) {
    if (DEBUG) console.error('[cart] applyCoupon failed', err)
    throw err
  }
}

async function removeCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-coupon`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (!res.ok) throw new Error('Coupon removal failed')
    state.cart_array = data || null
  } catch (err) {
    if (DEBUG) console.error('[cart] removeCoupon failed', err)
    throw err
  }
}

/* -------------------------
   Checkout
   BUG FIX: now uses syncLocalCartWithServer (batch) instead of mergeLocalIntoApi
   ------------------------- */
async function placeOrder(payload) {
  // Ensure server reflects local cart before placing order (batch sync)
  await syncLocalCartWithServer()

  try {
    const deviceId = localStorage.getItem('pwa_device_id') || null
    if (deviceId) payload.pwa_device_id = deviceId

    const res = await fetchWithToken(`${API_BASE}/checkout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Checkout failed')

    // Cancel any pending sync
    if (__syncDebounceTimer) {
      clearTimeout(__syncDebounceTimer)
      __syncDebounceTimer = null
    }

    // Clear local cart
    state.local_cart.items = []
    persistLocalCart()
    rebuildMergedView()

    state.cart_array = data || null
    state.synced = true

    return data
  } catch (err) {
    if (DEBUG) console.error('[cart] placeOrder failed', err.message)
    throw err
  }
}

/* -------------------------
   Init
   ------------------------- */
if (typeof window !== 'undefined') {
  loadLocalCart().then(() => rebuildMergedView())

  window.addEventListener('online', async () => {
    state.offline = false
    try {
      await fetchCart()
      await syncLocalCartWithServer()
    } catch (err) {
      if (DEBUG) console.warn('[cart] online sync failed', err)
    }
  })

  window.addEventListener('offline', () => {
    state.offline = true
  })

  window.addEventListener('storage', e => {
    if (e.key === LOCAL_CART_KEY || e.key === LEGACY_OFFLINE_KEY) {
      try {
        state.local_cart.items = JSON.parse(e.newValue || '[]')
        rebuildMergedView()
      } catch (err) {
        if (DEBUG) console.warn('[cart] storage sync failed', err)
      }
    }
  })
}

/* -------------------------
   Computed
   ------------------------- */
const hasItems = computed(() => state.items.length > 0)

/* -------------------------
   Exports
   ------------------------- */
export default {
  fetchCartOnce,
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
  syncLocalCartWithServer,
  signatureFor(productId, variationArray) {
    const varArr = Array.isArray(variationArray) ? variationArray : normalizeVariation(variationArray)
    const varSig = varArr
      .map(v => `${v.attribute || ''}:${v.value || ''}`)
      .filter(Boolean)
      .sort()
      .join('|')
    return `${productId}::${varSig}`
  }
}