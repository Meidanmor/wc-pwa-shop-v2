<template>
  <div class="q-mt-xl">
    <h3 class="text-h5 q-mb-md text-center">Related Products</h3>

    <!-- GRID MODE (for few products) -->
    <div v-if="products.length <= perSlide" class="row justify-center">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-xs-12 col-sm-6 col-md-3 q-mb-md"
      >
        <q-card class="q-pa-sm full-height">
          <router-link
            :to="`/product/${getSlugFromPermalink(product.permalink)}`"
            class="no-decoration full-width"
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
            <div v-else>Out of stock</div>
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
        <div class="row justify-center">
          <div
            v-for="product in group"
            :key="product.id"
            :class="colClass"
            class="q-mb-md"
          >
            <q-card class="q-pa-sm full-height flex column">
              <router-link
                :to="`/product/${product.slug}`"
                class="no-decoration full-width"
              >
                <q-img
                  :src="product.images?.[0]?.src"
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
                <div v-else>Out of stock</div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-carousel-slide>

      <!-- Custom navigation dots -->
      <template #navigation-icon="{ active, btnProps, onClick, index }">
        <q-btn
          v-bind="btnProps"
          :flat="false"
          :color="active ? 'primary' : (btnProps.color || 'grey-5')"
          size="sm"
          round
          dense
          @click="onClick"
        />
      </template>

      <!-- Custom arrows -->
      <template #control>
        <q-carousel-control position="left" class="flex items-center">
          <q-btn
            icon="chevron_left"
            aria-label="Previous"
            flat
            round
            dense
            color="primary"
            @click="prevSlide"
          />
        </q-carousel-control>
        <q-carousel-control position="right" class="flex items-center">
          <q-btn
            icon="chevron_right"
            aria-label="Next"
            flat
            round
            dense
            color="primary"
            @click="nextSlide"
          />
        </q-carousel-control>
      </template>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import cart from 'src/stores/cart'
import { fetchAllProducts } from 'src/boot/woocommerce'

const props = defineProps({
  productId: Number,
  categoryId: Number
})

const $q = useQuasar()
const slide = ref(0)
const products = ref([])
const perSlide = ref(4) // default desktop count

const addToCart = (product) => {
  cart.add(product.id)
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
  const allProducts = await fetchAllProducts()
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
