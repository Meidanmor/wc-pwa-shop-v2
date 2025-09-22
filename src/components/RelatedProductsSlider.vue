<template>
  <div class="q-mt-xl">
    <h3 class="text-h5 q-mb-md">Related Products</h3>

    <!-- GRID MODE -->
    <div v-if="products.length <= 4" class="row">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-xs-12 col-sm-6 col-md-3"
      >

        <q-card class="q-pa-sm full-height">
         <router-link
         :to="`/product/${getSlugFromPermalink(product.permalink)}`"
         class="no-decoration"
         >
          <q-img
            :src="product.images?.[0]?.thumbnail"
            :alt="product.name"
            class="q-mb-sm"
            style="height: 200px; object-fit: contain;"
          />
          <q-card-section>
            <div class="text-subtitle1 ellipsis text-secondary">{{ product.name }}</div>
            <div class="text-caption text-grey">
              <span v-html="product.price_html" />
            </div>
          </q-card-section>
          </router-link>
          <q-card-actions>
            <q-btn
              v-if="product.is_in_stock"
              color="primary"
              size="sm"
              label="Add to Cart"
              @click.stop="addToCart(product)"
            />
            <div v-else> Out of stock </div>
          </q-card-actions>
        </q-card>
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
      arrows
      control-color="primary"
      navigation
      height="auto"
      class="bg-transparent"
    >
      <q-carousel-slide
        v-for="(group, index) in productGroups"
        :key="index"
        :name="index"
        class="row"
      >
        <div
          v-for="product in group"
          :key="product.id"
          class="col-xs-6 col-sm-3"
        >
          <q-card class="q-pa-sm full-height flex column">
          <router-link :to="`/product/${product.slug}`" class="no-decoration">
            <q-img
              :src="product.images?.[0]?.thumbnail"
              :alt="product.name"
              class="q-mb-sm"
              style="height: 200px; object-fit: contain;"
            />
            <q-card-section>
              <div class="text-subtitle1 ellipsis text-secondary">{{ product.name }}</div>
              <div class="text-caption text-grey">
                <span v-html="product.price_html" />
              </div>
            </q-card-section>
            </router-link>
            <q-card-actions class="q-mt-auto">
              <q-btn
                v-if="product.is_in_stock"
                color="primary"
                size="sm"
                label="Add to Cart"
                @click.stop="addToCart(product)"
              />
              <div v-else> Out of stock </div>
            </q-card-actions>
          </q-card>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import cart from 'src/stores/cart'
import { fetchAllProducts } from 'src/boot/woocommerce'

const props = defineProps({
  productId: Number,
  categoryId: Number
})

const slide = ref(0)
const products = ref([])

const addToCart = (product) => {
  cart.add(product.id)
}

// More reliable slug extractor using regex
const getSlugFromPermalink = (permalink) => {
  const match = permalink.match(/product\/([^/]+)\/?$/)
  return match ? match[1] : ''
}

const productGroups = computed(() => {
  const chunkSize = window.innerWidth < 600 ? 2 : 4
  const chunks = []
  for (let i = 0; i < products.value.length; i += chunkSize) {
    chunks.push(products.value.slice(i, i + chunkSize))
  }
  return chunks
})

const fetchRelatedProducts = async () => {
  const allProducts = await fetchAllProducts()

  let related = allProducts
    .filter(
      (p) =>
        p.id !== props.productId &&
        p.categories.some((cat) => cat.id === props.categoryId) &&
        p.is_in_stock === true
    )
    .map((p) => ({
      ...p,
      slug: getSlugFromPermalink(p.permalink)
    }))

  if (related.length === 0) {
    related = allProducts
      .filter((p) => p.id !== props.productId && p.is_in_stock === true)
      .slice(0, 8)
      .map((p) => ({
        ...p,
        slug: getSlugFromPermalink(p.permalink)
      }))
  }

  products.value = related
  console.log(related);
}
onMounted(async () => {
fetchRelatedProducts();
console.log(products.value);
})
watch([() => props.productId, () => props.categoryId], () => {
  fetchRelatedProducts()
  console.log(products.value);

})
</script>
