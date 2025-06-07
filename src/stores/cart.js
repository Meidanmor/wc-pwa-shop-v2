// src/stores/cart.js
import { reactive, computed } from 'vue';
import { fetchWithToken } from 'src/composables/useApiFetch.js';

const API_BASE = 'https://nuxt.meidanm.com/wp-json/wc/store';

//const token = ref(localStorage.getItem('jwt_token'));

const state = reactive({
  items: [],
  items_count: 0,
totals: {},
coupons: [],
  loading: {cart: false, quickbuy: false, wishlist: false},
  error: null,
  cart_array: [],
  wishlist_items: [],
});

async function fetchCart() {

/*await fetchWithToken('https://nuxt.meidanm.com', {
  method: 'GET',
  credentials: 'include'
})
.then(res => console.log('Fetched homepage'+res))
.catch(console.error);
*/

  //state.loading.cart = true;
  state.error = null;
  try {
    const res = await fetchWithToken(`${API_BASE}/cart`, {
      credentials: 'include', // send cookies for session
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    const data = await res.json();
    // WooCommerce Store API returns an array of cart items under data.contents
    state.items = data.items || [];
    state.items_count = data.items_count || 0;
    state.totals = data.totals || {};
    state.coupons = data.coupons || [];
    state.cart_array = data || [];

    console.log(data);
  } catch (err) {
    state.error = err.message;
    state.items = [];
    state.items_count = 0;
  } finally {
    state.loading.cart = false;
    state.loading.quickbuy = false;
  }
}

async function add(productId, quantity = 1, variationId = null, variation = {}, $q=null) {
  if(state.loading.quickbuy === false) {
    state.loading.cart = true;
  }
  state.error = null;

  try {
    const payload = {
      id: variationId || productId,
      quantity,
    };

    if (variationId) {
      payload.variation = variation; // Only send this if it's a variation
    }

    console.log(payload);

    const res = await fetchWithToken(`${API_BASE}/cart/add-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Add to cart failed');

    await fetchCart();
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Product added to cart!',
      icon: 'shopping_cart'
    })

  } catch (err) {
    state.error = err.message;
    console.log(err);
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Failed to add to cart.',
      icon: 'error'
    })
  } finally {
    state.loading.cart = false;
    state.loading.quickbuy = false;
  }
}


async function fetchWishlistItems() {
    if (!process.env.CLIENT) return  // 💡 prevent SSR from running this

try{

   const res = await fetchWithToken('https://nuxt.meidanm.com/wp-json/wc/store/wishlist/',{
      method: 'GET',
      credentials: 'include',
  })
  const wishlistItems = await res.json();
  state.wishlist_items = wishlistItems;
  console.log(state.wishlist_items);

  } catch (err) {
    state.error = err.message;
    console.log(err);
  } finally {
    state.loading.wishlist = false;
  }
}
async function toggleWishlistItem(productId, $q=null) {
  state.loading.wishlist = true;
try{

   const res = await fetchWithToken('https://nuxt.meidanm.com/wp-json/wc/store/wishlist/',{

      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({product_id: productId}),
  })
  const wishlistItems = await res.json();

  if($q !== null) {
    if (Object.keys(state.wishlist_items.wishlist).length > Object.keys(wishlistItems.wishlist).length) {
      $q.notify({
        progress: true,
        type: 'warning',
        message: 'Removed from wishlist.',
        icon: 'delete'
      })
    } else {
      $q.notify({
        progress: true,
        type: 'positive',
        message: 'Added to wishlist!',
        icon: 'favorite'
      })
    }
  }
  state.wishlist_items = wishlistItems;

  } catch (err) {
    state.error = err.message;
    console.log(err);
  } finally {
    state.loading.wishlist = false;
  }
}

async function increase(productId, $q=null) {
  const item = state.items.find(i => i.id === productId)
  if (item) {
  console.log(item);
    await add(item.id, 1, item.id, item.variation, $q) // add 1 quantity
  }
}

async function decrease(cartItemKey, $q=null) {
  const item = state.items.find(i => i.key === cartItemKey);
  if (!item) return;

  const newQuantity = item.quantity - 1;
  if (newQuantity < 1) {
    await remove(cartItemKey, $q);
    return;
  }

  try {
    const res = await fetchWithToken(`${API_BASE}/cart/update-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        key: cartItemKey,
        quantity: newQuantity,
      }),
    });

    if (!res.ok) throw new Error('Failed to update quantity');
    await fetchCart();
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Product removed from the cart!',
      icon: 'shopping_cart'
    })
  } catch (err) {
    state.error = err.message;
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Failed to add to cart.',
      icon: 'error'
    })
  }
}

async function remove(cartItemKey, $q=null) {
  state.loading = true;
  state.error = null;
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-item`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ key: cartItemKey }),
    });
    if (!res.ok) throw new Error('Failed to remove item');
    await fetchCart();
    $q.notify({
      progress: true,
      type: 'positive',
      message: 'Product removed from the cart!',
      icon: 'shopping_cart'
    })
  } catch (err) {
    state.error = err.message;
    $q.notify({
      progress: true,
      type: 'negative',
      message: 'Failed to remove product.',
      icon: 'error'
    })

  } finally {
    state.loading = false;
  }
}

async function clear() {
  state.loading = true;
  state.error = null;
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/items`, {
      method: 'DELETE',
      credentials: 'include',
    });
    state.items = [];
    state.items_count = 0;
    state.totals = {};
    state.coupons = [];
    state.cart_array = [];

    if (!res.ok) throw new Error('Failed to clear cart');
    state.items = [];
  } catch (err) {
    state.error = err.message;
  } finally {
    state.loading = false;
  }
}

async function applyCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/apply-coupon`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code: code })
    })
    if (!res.ok) throw new Error('Coupon failed')
    await fetchCart()
  } catch (err) {
    console.error(err)
  }
}

async function removeCoupon(code) {
  try {
    const res = await fetchWithToken(`${API_BASE}/cart/remove-coupon`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ code: code })
    })
    if (!res.ok) throw new Error('Coupon removal failed')
    await fetchCart()
  } catch (err) {
    console.error(err)
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
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.message || 'Checkout failed')

    return data // Contains order ID etc.
  } catch (err) {
    console.error('Checkout error:', err.message)
    throw err
  }
}

// initialize cart on app start
fetchCart();
fetchWishlistItems();
export default {
  state,
  remove,
  add,
  clear,
  fetchCart,
  increase,
  decrease,
  applyCoupon,
removeCoupon,
placeOrder,
toggleWishlistItem,
fetchWishlistItems,
  count: computed(() => state.items.reduce((total, item) => total + item.quantity, 0)),
};
