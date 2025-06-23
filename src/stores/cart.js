// src/stores/cart.js
import { reactive, computed } from 'vue';
import { fetchWithToken } from 'src/composables/useApiFetch.js';

const API_BASE = 'MY_ENDPOINT_URL';
const state = reactive({
  items: [],
  items_count: 0,
  totals: {},
  coupons: [],
  loading: { cart: false, quickbuy: false, wishlist: false },
  error: null,
  cart_array: [],
  wishlist_items: [],
  offline: typeof navigator !== 'undefined' ? !navigator.onLine : true,
});

let wishlistQueue = [];

/* =============================
   Offline Storage Helpers
============================= */
function hasOfflineItems() {
  return Array.isArray(state.items)
    ? state.items.some(item => item.key?.startsWith('offline-'))
    : false;
}

async function replayOfflineItems() {
  const offlineItems = state.items.filter(item =>
    item.key?.startsWith('offline-')
  );
  for (const item of offlineItems) {
    try {
      const res = await fetchWithToken(`${API_BASE}/cart/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: item.id, quantity: item.quantity }),
      });
      if (!res.ok) throw new Error('Add to cart failed during replay');
    } catch (err) {
      console.warn(`[cart.js] Failed to replay item ${item.id}: ${err.message}`);
    }
  }
  state.items = state.items.filter(item => !item.key?.startsWith('offline-'));
  persistCartOffline();
}

function persistCartOffline() {
  localStorage.setItem('offline_cart', JSON.stringify(state.items));
}

function loadOfflineCart() {
  const offlineCart = localStorage.getItem('offline_cart');
  if (offlineCart) {
    try {
      const parsed = JSON.parse(offlineCart);
      state.items = parsed;
      state.items_count = parsed.reduce((sum, i) => sum + i.quantity, 0);
    } catch (e) {
      console.warn('Failed to parse offline cart:', e);
    }
  }
}

function persistWishlistOffline() {
  localStorage.setItem('offline_wishlist', JSON.stringify(state.wishlist_items));
  localStorage.setItem('wishlist_queue', JSON.stringify(wishlistQueue));
}

function loadOfflineWishlist() {
  const local = localStorage.getItem('offline_wishlist');
  const queue = localStorage.getItem('wishlist_queue');
  if (local) {
    try {
      state.wishlist_items = JSON.parse(local);
    } catch (e) {
      console.warn('Failed to parse wishlist:', e);
    }
  }
  if (queue) {
    try {
      wishlistQueue = JSON.parse(queue);
    } catch (e) {
      wishlistQueue = [];
    }
  }
}

/* =============================
   Event Listeners
============================= */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[cart.js] Went online');
    state.offline = false;
    replayOfflineItems();
    syncOfflineWishlist();
  });
  window.addEventListener('offline', () => {
    console.log('[cart.js] Went offline');
    state.offline = true;
  });
}

/* =============================
   Cart Logic
============================= */
async function fetchCart() {
  if (state.offline) {
    loadOfflineCart();
    return;
  }

  if (hasOfflineItems()) {
    await replayOfflineItems();
  }

  state.loading.cart = true;
  state.error = null;

  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    const data = await res.json();

    state.items = data.items || [];
    state.items_count = data.items_count || 0;
    state.totals = data.totals || {};
    state.coupons = data.coupons || [];
    state.cart_array = data || [];

    persistCartOffline();
  } catch (err) {
    state.error = err.message;
    loadOfflineCart();
  } finally {
    state.loading.cart = false;
    state.loading.quickbuy = false;
  }
}

async function add(productId, quantity = 1, variationId = null, variation = {}, $q = null) {
  state.loading.cart = true;
  state.error = null;

  let payload = { name: '', id: variationId || productId, quantity };
  if (variationId) payload.variation = variation;

  if (state.offline) {
    const res = await fetch('https://nuxt.meidanm.com/wp-json/wc/store/v1/products?per_page=100');
    const products = await res.json();
    const id = variationId || productId;
    const productArr = products.find(p => p.id === id) || {};
    productArr.quantity = quantity;
    payload = productArr;

    const key = 'offline-' + Date.now();
    productArr.key = key;

    const offlineItem = { ...payload };
    state.items.push(offlineItem);
    state.items_count += quantity;
    persistCartOffline();

    if ($q) {
      $q.notify({ type: 'info', message: 'Offline: added to local cart.', icon: 'cloud_off' });
    }

    state.loading.cart = false;
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/add-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Add to cart failed');

    await fetchCart();

    if ($q) {
      $q.notify({ type: 'positive', message: 'Product added to cart!', icon: 'shopping_cart' });
    }
  } catch (err) {
    state.error = err.message;
    if ($q) {
      $q.notify({ type: 'negative', message: 'Failed to add to cart.', icon: 'error' });
    }
  } finally {
    state.loading.cart = false;
  }
}

async function increase(productId, $q = null) {
  const item = state.items.find(i => i.id === productId);
  if (item) {
    await add(item.id, 1, item.id, item.variation, $q);
  }
}

async function decrease(cartItemKey, $q = null) {
  const item = state.items.find(i => i.key === cartItemKey);
  if (!item) return;

  const newQty = item.quantity - 1;
  if (newQty < 1) {
    return remove(cartItemKey, $q);
  }

  if (state.offline) {
    item.quantity = newQty;
    state.items_count -= 1;
    persistCartOffline();
    state.loading.cart = false;
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/update-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ key: cartItemKey, quantity: newQty }),
    });
    if (!res.ok) throw new Error('Failed to update quantity');
    await fetchCart();

    if ($q) {
      $q.notify({ type: 'positive', message: 'Quantity updated.', icon: 'shopping_cart' });
    }
  } catch (err) {
    state.error = err.message;
    if ($q) {
      $q.notify({ type: 'negative', message: 'Failed to update.', icon: 'error' });
    }
  } finally {
    state.loading.cart = false;
  }
}

async function remove(cartItemKey, $q = null) {
  state.loading.cart = true;
  state.error = null;

  if (state.offline) {
    const idx = state.items.findIndex(i => i.key === cartItemKey);
    if (idx !== -1) {
      state.items.splice(idx, 1);
      state.items_count = state.items.reduce((sum, i) => sum + i.quantity, 0);
      persistCartOffline();
    }
    state.loading.cart = false;
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ key: cartItemKey }),
    });
    if (!res.ok) throw new Error('Failed to remove item');
    await fetchCart();

    if ($q) {
      $q.notify({ type: 'positive', message: 'Removed from cart.', icon: 'shopping_cart' });
    }
  } catch (err) {
    state.error = err.message;
    if ($q) {
      $q.notify({ type: 'negative', message: 'Failed to remove.', icon: 'error' });
    }
  } finally {
    state.loading.cart = false;
  }
}

async function clear() {
  state.loading.cart = true;
  state.error = null;

  if (state.offline) {
    state.items = [];
    state.items_count = 0;
    persistCartOffline();
    state.loading.cart = false;
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/items`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to clear cart');
    state.items = [];
    state.items_count = 0;
    state.totals = {};
    state.cart_array = [];
    persistCartOffline();
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading.cart = false;
  }
}

/* =============================
   Wishlist
============================= */
async function applyCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/apply-coupon`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!res.ok) throw new Error('Coupon failed');
    await fetchCart();
  } catch (err) {
    console.error(err);
  }
}

async function removeCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-coupon`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    if (!res.ok) throw new Error('Coupon removal failed');
    await fetchCart();
  } catch (err) {
    console.error(err);
  }
}

async function placeOrder(payload) {
  try {
    const res = await fetchWithToken(`${API_BASE}/checkout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Checkout failed');

    return data; // order ID etc.
  } catch (err) {
    console.error('Checkout error:', err.message);
    throw err;
  }
}

/* -----------------------------
   Wishlist Support
----------------------------- */
async function fetchWishlistItems() {
  if (!process.env.CLIENT || state.offline) {
    loadOfflineWishlist();
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
      method: 'GET',
      credentials: 'include',
    });

    const wishlistItems = await res.json();
    state.wishlist_items = wishlistItems;
    persistWishlistOffline();
  } catch (err) {
    state.error = err.message;
    console.log(err);
  } finally {
    state.loading.wishlist = false;
  }
}

async function toggleWishlistItem(productId, $q = null) {
  state.loading.wishlist = true;

  try {
    if (state.offline) {
      const current = state.wishlist_items.wishlist || [];
      const exists = current.includes(productId);
      const updated = exists
        ? current.filter(id => id !== productId)
        : [...current, productId];

      state.wishlist_items.wishlist = updated;
      wishlistQueue.push({ product_id: productId, action: exists ? 'remove' : 'add' });
      persistWishlistOffline();

      if ($q) {
        $q.notify({
          type: exists ? 'warning' : 'positive',
          message: exists ? 'Removed from wishlist (offline).' : 'Added to wishlist (offline).',
          icon: exists ? 'delete' : 'favorite',
        });
      }
    } else {
      const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ product_id: productId }),
      });

      const wishlistItems = await res.json();
      state.wishlist_items = wishlistItems;
      persistWishlistOffline();

      if ($q) {
        $q.notify({
          type: 'positive',
          message: 'Wishlist updated!',
          icon: 'favorite',
        });
      }
    }
  } catch (err) {
    state.error = err.message;
    console.log(err);
  } finally {
    state.loading.wishlist = false;
  }
}

async function syncOfflineWishlist() {
  if (!wishlistQueue.length) return;
  for (const entry of wishlistQueue) {
    try {
      await fetchWithToken(`${API_BASE}/wishlist/`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ product_id: entry.product_id }),
      });
    } catch (err) {
      console.warn('Wishlist sync failed for', entry.product_id);
    }
  }
  wishlistQueue = [];
  localStorage.removeItem('wishlist_queue');
  fetchWishlistItems();
}

if (typeof window !== 'undefined') {
  fetchCart();
  fetchWishlistItems();
}

export default {
  state,
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
  count: computed(() => state.items.reduce((t, i) => t + i.quantity, 0)),
};