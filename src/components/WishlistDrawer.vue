<template>
    <q-scroll-area v-if="isHydrated" class="fit q-pa-sm">

    <div>
    <h4> Wishlist </h4>
      <div v-if="cart.state.wishlist_items && cart.state.wishlist_items.length === 0" class="text-center text-grey">
      Your wishlist is empty.
      </div>
      <div v-else-if="cart.state.wishlist_items && cart.state.wishlist_items.length > 0" v-for="product in cart.state.wishlist_items" :key="product.id" class="relative-position q-pa-sm row">
        <router-link :to="`/product/${product.slug}/`" class="flex no-wrap q-pr-lg no-decoration text-secondary">
          <img v-if="product.image" :src="product.image" :alt="product.name" style="width: 100px; height: 100px; object-fit: cover" />
          <div class="q-ml-sm column">
            <div>{{ product.name }}</div>
            <q-btn label="Add to Cart" color="primary" @click="addToCart(product)" />
          </div>
        </router-link>
        <q-btn class="absolute absolute-top-right" :icon="matClose" flat @click.stop.prevent="removeFromWishlist(product.id)" />

      </div>

    </div>
    </q-scroll-area>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import cart from 'src/stores/cart.js'
import { matClose } from '@quasar/extras/material-icons'

const wishlist = computed(() => cart.state.wishlist_items)
const isHydrated = ref(false)

async function addToCart(p){
cart.add(p.id, 1);
}

async function removeFromWishlist(id) {
  try {
    await cart.toggleWishlistItem(id)
    console.log(wishlist.value);
  } catch (err) {
    console.error('Error removing from wishlist:', err)
  }
}
onMounted(() => {
  isHydrated.value = true // Vue is now fully in control of the DOM
})

</script>
