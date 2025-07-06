<template>
    <q-scroll-area class="fit q-pa-sm">
    <div v-if="loading" class="text-center q-my-md">
      <q-spinner />
    </div>

    <div v-else-if="cart.state.wishlist_items && cart.state.wishlist_items.length === 0" class="text-center text-grey">
      Your wishlist is empty.
    </div>

    <div v-else-if="cart.state.wishlist_items && cart.state.wishlist_items.length > 0">
    <h4> Wishlist </h4>
      <div v-for="product in cart.state.wishlist_items" :key="product.id" class="relative-position q-pa-sm row">
        <router-link :to="`/product/${product.slug}/`" class="flex no-wrap q-pr-lg no-decoration text-secondary">

          <img v-if="product.image" :src="product.image" :alt="product.name" style="width: 100px; height: 100px; object-fit: cover" />
          <div class="q-ml-sm column">
            <div>{{ product.name }}</div>
            <q-btn label="Add to Cart" color="primary" @click="addToCart(product)" />
          </div>
        </router-link>
        <q-btn class="absolute absolute-top-right" icon="close" flat @click.stop.prevent="removeFromWishlist(product.id)" />

      </div>

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

if(cart.state.wishlist_items) {
  wishlist.value = cart.state.wishlist_items;
}

loading.value = false;

}

async function removeFromWishlist(id) {
  try {
    await cart.toggleWishlistItem(id)
    wishlist.value = wishlist.value.filter(p => p.id !== id)
    console.log(wishlist.value);
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
  if(newWishlist && oldWishlist){
  if(newWishlist.length != oldWishlist.length){
    fetchWishlist();
    }
    }
  }
)

</script>
