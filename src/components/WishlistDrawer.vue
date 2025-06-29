<template>
    <q-scroll-area class="fit q-pa-sm">
    <div v-if="loading" class="text-center q-my-md">
      <q-spinner />
    </div>

    <div v-else-if="cart.state.wishlist_items.wishlist && cart.state.wishlist_items.wishlist.length === 0" class="text-center text-grey">
      Your wishlist is empty.
    </div>

    <div v-else-if="cart.state.wishlist_items.wishlist && cart.state.wishlist_items.wishlist.length > 0">
    <h4> Wishlist </h4>
      <q-item v-for="product in cart.state.wishlist_items.wishlist" :key="product.id">
        <q-item-section avatar>
        </q-item-section>
        <q-item-section>
          <q-img :src="product.image" :alt="product.name" />
          <router-link :to="`/product/${product.slug}/`"><q-item-label>{{ product.name }}</q-item-label></router-link>
          <q-btn label="Add to Cart" color="primary" @click="addToCart(product)" />
          <q-item-label caption>{{ product.price_html }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn icon="close" flat @click.stop.prevent="removeFromWishlist(product.id)" />
        </q-item-section>
      </q-item>
    </div>
    </q-scroll-area>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import cart from 'src/stores/cart.js'
const wishlist = ref([])
const loading = ref(true)

async function addToCart(p){
cart.add(p.id, 1);
}
async function fetchWishlist() {
await cart.fetchWishlistItems();

if(cart.state.wishlist_items.wishlist) {
  wishlist.value = cart.state.wishlist_items.wishlist;
}

loading.value = false;

}

async function removeFromWishlist(id) {
  try {
    await cart.toggleWishlistItem(id)
    wishlist.value = wishlist.value.filter(p => p.id !== id)
  } catch (err) {
    console.error('Error removing from wishlist:', err)
  }
}

onMounted(() => {
fetchWishlist()
}
)

watch(
  () => cart.state.wishlist_items,
  (newWishlist, oldWishlist) => {
  if(newWishlist.wishlist && oldWishlist.wishlist){
  if(newWishlist.wishlist.length != oldWishlist.wishlist.length){
    fetchWishlist();
    }
    }
  }
)

</script>
