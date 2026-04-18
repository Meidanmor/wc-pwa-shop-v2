<template>
  <section class="related-products">
  <div class="container">
    <h3 class="text-h5 q-mb-md text-center">Related Products</h3>

    <!-- GRID MODE (for few products) -->
    <div v-if="products.length <= perSlide" class="related-product-wrapper row justify-center">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-xs-12 col-sm-6 col-md-3 q-mb-md relative-position"
      >
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
            width="100%"
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

      </div>
    </div>

    <!-- SLIDER MODE -->
    <q-carousel
        @touchstart.stop
        @mousedown.stop
      v-else
      v-model="slide"
      animated
      infinite
      swipeable
      :arrows="false"
      navigation
      control-color="primary"
      height="auto"
      class="bg-transparent"
    >
      <q-carousel-slide
        v-for="(group, index) in slideChunks"
        :key="index"
        :name="index"
      >
        <div class="related-product-wrapper row justify-center">
          <div
            v-for="product in group"
            :key="product.id"
            :class="[colClass, 'q-mb-md', 'relative-position']"
          >

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
            width="100%"
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

          </div>
        </div>
      </q-carousel-slide>
'
      <!-- Custom navigation dots -->
      <template #navigation-icon="{ active, btnProps, onClick, index }">
        <q-btn
            v-bind="btnProps"
            :flat="false"
            :color="active ? 'secondary' : (btnProps.color || 'grey-5')"
            size="sm"
            :icon="null"
            style="font-size: 5px;padding: 0"
            round
            dense
            :aria-label="`Go to slide ${index + 1}`"
            @click="onClick"
        />
      </template>

      <!-- Custom arrows -->
      <template #control>
        <q-carousel-control position="left" class="flex items-center">
          <q-btn
            :icon="matChevronLeft"
            aria-label="Previous"
            flat
            round
            dense
            color="secondary"
            @click="prevSlide"
          />
        </q-carousel-control>
        <q-carousel-control position="right" class="flex items-center">
          <q-btn
            :icon="matChevronRight"
            aria-label="Next"
            flat
            round
            dense
            color="secondary"
            @click="nextSlide"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import cart from 'src/stores/cart'
//import { fetchAllProducts } from 'src/boot/woocommerce'
import { matChevronLeft, matChevronRight, matFavorite, matFavoriteBorder } from '@quasar/extras/material-icons'

const props = defineProps({
  productId: Number,
  categoryId: Number
})

const $q = useQuasar()
const slide = ref(0)
const products = ref([])
const perSlide = ref(4) // default desktop count

async function addToWishlist(objID = 0) {
  await cart.toggleWishlistItem(objID, $q);
}

const addToCart = (product) => {
  cart.add(product.id, 1, null, {}, null, product)
}

const getSlugFromPermalink = (permalink) => {
  const match = permalink.match(/product\/([^/]+)\/?$/)
  return match ? match[1] : ''
}

// Responsive per-slide setup
const updatePerSlide = () => {
  if ($q.screen.lt.sm) perSlide.value = 2
  else if ($q.screen.lt.md) perSlide.value = 3
  else perSlide.value = 4
}
updatePerSlide()
watch(() => $q.screen.name, updatePerSlide)

const colClass = computed(() => {
  if ($q.screen.lt.sm) return 'col-6'
  if ($q.screen.lt.md) return 'col-4'
  return 'col-3'
})

const slideChunks = computed(() => {
  const chunks = []
  for (let i = 0; i < products.value.length; i += perSlide.value) {
    chunks.push(products.value.slice(i, i + perSlide.value))
  }
  return chunks
})

// Slide controls
const prevSlide = () => {
  slide.value = (slide.value - 1 + slideChunks.value.length) % slideChunks.value.length
}
const nextSlide = () => {
  slide.value = (slide.value + 1) % slideChunks.value.length
}

const fetchRelatedProducts = async () => {
  const res = await fetch('/data/products.json');
  const allProducts = await res.json();
  let related = allProducts
    .filter(
      (p) =>
        p.id !== props.productId &&
        p.categories.some((cat) => cat.id === props.categoryId) &&
        p.is_in_stock
    )
    .map((p) => ({
      ...p,
      slug: getSlugFromPermalink(p.permalink)
    }))

  if (related.length === 0) {
    related = allProducts
      .filter((p) => p.id !== props.productId && p.is_in_stock)
      .slice(0, 8)
      .map((p) => ({
        ...p,
        slug: getSlugFromPermalink(p.permalink)
      }))
  }

  products.value = related
}

onMounted(fetchRelatedProducts)

watch([() => props.productId, () => props.categoryId], fetchRelatedProducts)
</script>

<style>
.related-products .related-product-wrapper > div {
    padding: 20px 5px;
}
.related-products .related-product-wrapper > div,
.related-products .related-product-wrapper > div .q-card{
    transition: 0.3s ease;
}

.related-products .related-product-wrapper > div:hover {
  transform: translateY(-10px);
  z-index: 1;
}

.related-products .related-product-wrapper > div:hover .q-card {
  opacity: 0.8;
  box-shadow: 0px 10px 25px #00000020;
}

.related-products img.q-img__image {
  object-fit: cover;
  height: 100%;
}
.related-products .q-img.q-img--menu.q-mb-sm {
    height: 200px;
}
</style>
