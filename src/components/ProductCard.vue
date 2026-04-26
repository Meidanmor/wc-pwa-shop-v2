<template>
  <router-link :to="`/product/${getSlugFromPermalink(product.permalink)}`">
          <div class="item-loop-wl absolute">
              <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-if="cart.state.wishlist_items && Object.values(cart.state.wishlist_items).find(obj => product.id === obj.id)" @click.prevent="addToWishlist(product.id)" color="accent" :icon="matFavorite" />
              <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-else @click.prevent="addToWishlist(product.id)" color="accent" :icon="matFavoriteBorder" />
          </div>

          <q-card class="my-card full-height">
            <q-img
            :img-src="product.images[0]?.src"
            :src="product.images[0]?.src"
            :srcset="product.images[0]?.srcset"
            :sizes="product.images[0]?.sizes"
            :alt="product.name"
            height="250px"
            width="auto"
            class="rounded-borders"
            />
            <div class="flex q-pa-md">
              <div class="full-width q-mb-sm">
              <div>{{ product.name }}</div>
              <div class="text-subtitle2" v-html="product.price_html" />
              </div>
              <div v-if="product.status && product.status === 'draft'"><b>This is a draft product. It's shown for admins only!</b></div>
              <q-btn v-else-if="product.is_in_stock && product.type !== 'variable'" label="Add to Cart" color="secondary" @click.prevent="addToCart(product)" />
              <q-btn v-else-if="product.is_in_stock && product.type === 'variable'" :to="`/product/${getSlugFromPermalink(product.permalink)}`" label="Choose options" color="secondary" />
              <div v-else>Out of stock</div>
              </div>
          </q-card>
  </router-link>
</template>

<script setup>
//import { computed } from 'vue'
import { matFavorite, matFavoriteBorder } from '@quasar/extras/material-icons'
import cart from 'src/stores/cart' // your existing cart.js
import { useQuasar } from 'quasar'
import { defineAsyncComponent } from 'vue'

const $q = useQuasar()

const QCard = defineAsyncComponent(() => import('quasar').then(m => m.QCard))

defineProps({
  product: {
    type: Object,
    required: true
  }
})

/*const isWishlisted = computed(() => {
  const items = cart.state.wishlist_items || {}

  return Object.values(items).some(
    item => item.id === props.product.id
  )
})*/

const getSlugFromPermalink = (permalink) => {
  return permalink.split('/').filter(Boolean).pop()
}
const addToCart = (product) => {
  cart.add(product.id, 1)
  console.log('Added to cart:', product.id)
}

async function addToWishlist(objID = 0) {
  await cart.toggleWishlistItem(objID, $q);
}
</script>