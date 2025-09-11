// src/stores/cart.js
import { reactive, computed } from 'vue';
import { fetchWithToken } from 'src/composables/useApiFetch.js';

const API_BASE = 'https://nuxt.meidanm.com/wp-json/wc/store';
//const offlineQueue = []; // Top of cart.js

const state = reactive({
  items: [],
  items_count: 0,
  totals: {},
  coupons: [],
  loading: { cart: false, quickbuy: false, wishlist: false },
  error: null,
  cart_array: [],
  wishlist_items: {},
  user: {},
  offline: typeof navigator !== 'undefined' ? !navigator.onLine : true,
  drawerOpen: false
});
/* =============================
   Offline Storage Helpers
============================= */
function hasOfflineItems() {
  return Array.isArray(state.items)
    ? state.items.some(item => item.key?.startsWith('offline-'))
    : false;
}
/*function WLhasOfflineItems() {
  return Array.isArray(state.wishlist_items.wishlist)
    ? state.wishlist_items.wishlist.some(item => item?.offline === true ) : false;
}*/
async function replayOfflineItems() {
  const offlineItems = state.items.filter(item =>
    item.key?.startsWith('offline-')
  );
  console.log(offlineItems);

  for (const item of offlineItems) {
    try {
      const res = await fetchWithToken(`${API_BASE}/cart/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: item.id,
          quantity: item.quantity,
        }),
      });

      if (!res.ok) throw new Error('Add to cart failed during replay');
      console.log(`[cart.js] Replayed offline item: ${item.id}`);
    } catch (err) {
      console.warn(`[cart.js] Failed to replay item ${item.id}: ${err.message}`);
    }
  }

  // Clear offline items from local state
  state.items = state.items.filter(
    item => !item.key?.startsWith('offline-')
  );
  persistCartOffline(); // Save cleaned local state
}

async function WLreplayOfflineItems(fetchedWL) {
  const offlineItems = state.wishlist_items;
  const currentFetchedItems = fetchedWL.wishlist;
  console.log(offlineItems);
  console.log(fetchedWL.wishlist);

  console.log(fetchedWL.wishlist.length > offlineItems.length);
  console.log(fetchedWL.wishlist.length);
  console.log(offlineItems.length);
  const currentFetchedIDs = [];
  const currentOfflineIDs = [];
  if(currentFetchedItems.length > 0) {
    for (const currentFetchedItem of currentFetchedItems) {
      if (currentFetchedItem.id) {
        currentFetchedIDs.push(currentFetchedItem.id);
      }
    }
  }
  if(offlineItems.length > 0) {

    for (const offlineItem of offlineItems) {
      console.log(offlineItem.id);

      if (offlineItem.id) {
        console.log(offlineItem.id);
        currentOfflineIDs.push(offlineItem.id);
      }
    }
  }

  if(currentOfflineIDs.length > 0) {
    for (const itemID of currentOfflineIDs) {
      if (!currentFetchedIDs.includes(itemID)) {
        try {
          const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({product_id: itemID}),
          });

          if (res.ok) {
            console.log('Item has been removed!' + itemID + ' ' + res)
          }
        } catch (err) {
          console.log(err)
        }

      }

    }
  }
  for( const fetchedItemID of currentFetchedIDs) {
    if (currentOfflineIDs.length>0 && !currentOfflineIDs.includes(fetchedItemID)) {
      try {
        const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({product_id: fetchedItemID}),
        });

        if (res.ok) {
          console.log('Item has been removed!' + fetchedItemID + ' ' + res)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

}

function persistCartOffline() {
  localStorage.setItem('offline_cart', JSON.stringify(state.items));
}

function persistWLOffline() {
  console.log(state.wishlist_items);
  localStorage.setItem('offline_wl', JSON.stringify(state.wishlist_items));
}

function loadOfflineCart() {
  const offlineCart = localStorage.getItem('offline_cart');
  if (offlineCart) {
    console.log(offlineCart)
    try {
      const parsed = JSON.parse(offlineCart);
      state.items = parsed;
      state.items_count = parsed.reduce((sum, i) => sum + i.quantity, 0);
      console.warn(state.items);
      console.warn(state.items_count);
    } catch (e) {
      console.warn('Failed to parse offline cart:', e);
    }
  }
}

function loadOfflineWL() {
  const offlineCart = localStorage.getItem('offline_wl');
  if (offlineCart) {
    console.log(offlineCart);
    try {
      const parsed = JSON.parse(offlineCart);
      state.wishlist_items = parsed;
      //state.items_count = parsed.reduce((sum, i) => sum + i.quantity, 0);
    } catch (e) {
      console.warn('Failed to parse offline wl:', e);
    }
  }
}

// Watch online/offline
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[cart.js] Went online');
    state.offline = false;
  });
  window.addEventListener('offline', () => {
    console.log('[cart.js] Went offline');
    state.offline = true;
  });

  console.log('[cart.js] online/offline status listener attached');

}

/* =============================
   Cart Logic
============================= */
async function updateCartState(data) {
  state.items = data.items || [];
  state.items_count = data.items_count || 0;
  state.totals = data.totals || {};
  state.coupons = data.coupons || [];
  state.cart_array = data || [];
  persistCartOffline(); // Save latest version locally

}

async function fetchCart() {
  if (state.offline) {
    loadOfflineCart();
    return;
  }

  // Before we fetch: replay offline actions if any
  if (hasOfflineItems()) {
    console.log('[cart.js] Replaying offline items...');
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
    updateCartState(data);

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
    const res = await fetch(`${API_BASE}/v1/products?per_page=100`)
    const products = await res.json()
    const id = variationId || productId;
    const productArr = products.find(p => p.id === id) ? products.find(p => p.id === id): {};
    productArr.quantity = quantity;

   payload = productArr;
   console.log(payload);

    const key = 'offline-' + Date.now();
    productArr.key = key;

    const offlineItem = { ...payload };

    //let itemUpdated = false;
    console.log(offlineItem);
    /*if(state.items.length) {
      state.items.forEach((item) => {
        if (item.id === offlineItem.id && item.key && item.key.includes('offline')) {
          item.quantity = (item.quantity + offlineItem.quantity);
          itemUpdated = true;
        }
      })

    }
    if(!itemUpdated) {
    }*/
      state.items.push(offlineItem);

    state.items_count += quantity;
    persistCartOffline();

    if ($q) {
      $q.notify({ type: 'info', message: 'Offline: added to local cart.', icon: 'cloud_off' });
    }

    state.loading.cart = false;
    state.loading.quickbuy = false;
    state.drawerOpen = true;
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

    await updateCartState(data);

    if ($q) {
      $q.notify({ type: 'positive', message: 'Product added to cart!', icon: 'shopping_cart' });
    }
    state.drawerOpen = true;

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
    //state.loading.quickbuy = false;
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/update-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ key: cartItemKey, quantity: newQty }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error('Failed to update quantity');

    await updateCartState(data);

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

    const data = await res.json();
    if (!res.ok) throw new Error('Failed to remove item');

        await updateCartState(data);

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

    const data = await res.json();

    if (!res.ok) throw new Error('Failed to clear cart');
    await updateCartState(data);
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading.cart = false;
  }
}

/* =============================
   Wishlist / Order APIs
============================= */
async function applyCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/apply-coupon`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error('Coupon failed');
    await updateCartState(data);
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

    const data = await res.json();
    if (!res.ok) throw new Error('Coupon removal failed');
        await updateCartState(data);
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
  if (!process.env.CLIENT) return;
  if (state.offline) {
    loadOfflineWL();
    return;
  }

  state.loading.wishlist = true;
  try {
    const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
      method: 'GET',
      credentials: 'include',
    });
    const wishlistItems = await res.json();

    // Replay offline items first
    console.log('[cart.js] Replaying offline WL items...');
    await WLreplayOfflineItems(wishlistItems);

    // Update state only once
    state.wishlist_items = wishlistItems.wishlist;

  } catch (err) {
    state.error = err.message;
    console.log(err);
    loadOfflineWL();
  } finally {
    state.loading.wishlist = false;
    persistWLOffline();
  }
}


async function toggleWishlistItem(productId, $q = null) {
  state.loading.wishlist = true;

  if(state.offline){
    //console.log(state.wishlist_items.wishlist)

    const res = await fetch(`${API_BASE}/v1/products?per_page=100`)
    const products = await res.json()
    const id = productId;
    const productArr = products.find(p => p.id === id) ? products.find(p => p.id === id): {};

    if(productArr.id){
      const payload = {
        'offline': true,
        'id': productArr.id,
        'name': productArr.name,
        'image': productArr.images.length > 0 ? productArr.images[0].src : '',
        'price': productArr.prices.price,
        'slug': productArr.slug,
      };

      console.log(state.wishlist_items);
      if(!state.wishlist_items || state.wishlist_items.length === 0){
        state.wishlist_items = [payload];
      } else {
        if(!state.wishlist_items.find(p => p.id === productArr.id)) {
          state.wishlist_items.push(payload)
          console.log('PUSHED!!!!');

        } else {
          state.wishlist_items = state.wishlist_items.filter(p => p.id !== productArr.id)
        }
        console.log(state.wishlist_items)
        localStorage.setItem('offline_wl', JSON.stringify(state.wishlist_items));
      }
    }
    state.loading.wishlist = false;

    return;
  }
  try {
    const res = await fetchWithToken(`${API_BASE}/wishlist/`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ product_id: productId }),
    });

    const wishlistItems = await res.json();
    state.wishlist_items = wishlistItems.wishlist;

    if ($q) {
      const oldCount = Object.keys(state.wishlist_items || {}).length;
      const newCount = Object.keys(wishlistItems.wishlist || {}).length;

      $q.notify({
        progress: true,
        type: oldCount > newCount ? 'warning' : 'positive',
        message: oldCount > newCount ? 'Removed from wishlist.' : 'Added to wishlist!',
        icon: oldCount > newCount ? 'delete' : 'favorite',
      });
    }
  } catch (err) {
    state.error = err.message;
    console.log(err);
  } finally {
    state.loading.wishlist = false;
  }
}


/* Init on client side */
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
