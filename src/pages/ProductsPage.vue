<template>
  <q-page class="q-pa-md">
    <div class="container">
  <h2>Products</h2>

      <!-- Search and Filter -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-md-6">
          <q-input filled v-model="search" label="Search products..." debounce="300" />
        </div>
        <div class="col-xs-12 col-md-6">
          <q-select
            filled
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Filter by category"
            emit-value
            map-options
            clearable
          />
        </div>
      </div>

<q-card
  class="q-pa-md q-mb-md"
>
  <div class="text-subtitle1 q-mb-sm">Filter by Price</div>
  <q-range
    v-model="priceRange"
    :min="priceMin"
    :max="priceMax"
    label-always
    label
    dense
    color="primary"
    @change="paginatedProducts"
  />
</q-card>


      <!-- Total Products -->
      <div v-if="filteredProducts && filteredProducts.length" class="text-subtitle1 q-mb-sm">
        Found {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }}
      </div>

      <!-- Product Grid -->
      <div class="row q-col-gutter-md">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-xs-12 col-sm-6 col-md-4"
        >
          <q-card class="my-card full-height">
            <q-img
              v-if="product.images.length"
              :src="product.images[0].src"
              :alt="product.name"
              height="300px"
              width="auto"
              class="rounded-borders"
            />
            <q-img
              v-else
              src="https://via.placeholder.com/400x300?text=No+Image"
              alt="No image available"
              ratio="4/3"
              class="rounded-borders"
            />
            <q-card-section>
              <div class="text-h6">{{ product.name }}</div>
              <div class="text-subtitle2" v-html="product.price_html" />
            </q-card-section>
            <q-card-actions>
              <q-btn label="Add to Cart" color="primary" @click="addToCart(product)" />
              <q-btn
                label="View"
                color="secondary"
                :to="`/product/${getSlugFromPermalink(product.permalink)}`"
                flat
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Pagination -->
      <div class="q-mt-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          max-pages="6"
          boundary-numbers
          direction-links
          color="primary"
        />
      </div>

    </div>
  </q-page>
</template>

<script setup async>
import { ref, computed, onMounted, watch } from 'vue'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useMeta } from 'quasar'

// Refs and state
const products = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const search = ref('')
const currentPage = ref(1)
const perPage = 6

const seoData = ref({
  title: 'Home page',
  description: 'Home page description'
});

// Fetch SEO data during SSR
async function fetchSeoData() {
  try {
    const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent('shop')}`)
    const json = await res.json()
    console.log(json);
    seoData.value = {
      title: json.title,
      description: json.description
    }
    console.log('[SSR] Fetched SEO:', json.title)
  } catch (err) {
    console.error('[SSR] SEO Fetch Error:', err)
  }
}

// Fetch products and auto-set price range
const fetchProducts = async () => {
  const res = await api.getProducts()
  products.value = Array.isArray(res) ? res : []

  const prices = products.value.map((p) =>
    parseFloat(
      p.prices.price_range != null
        ? p.prices.price_range.max_amount
        : p.prices.price
    ) / 100
  )

  const min = Math.floor(Math.min(...prices))
  const max = Math.ceil(Math.max(...prices))
  priceMin.value = min
  priceMax.value = max
  priceRange.value = { min, max }
}

// Fetch categories
const fetchCategories = async () => {
  categories.value = await api.getCategories()
}
const isServer = process.env.SERVER

if (isServer) {
  await fetchSeoData()
  await fetchProducts()
  await fetchCategories()
}

useMeta(() => ({
  title: seoData.value.title,
  meta: {
    description: {
      name: 'description',
      content: seoData.value.description
    },
    'og:title': {
      property: 'og:title',
      content: seoData.value.title
    },
    'og:description': {
      property: 'og:description',
      content: seoData.value.description
    }
  }
}))

// Price filter
const priceMin = ref(0)
const priceMax = ref(1000)
const priceRange = ref({ min: 0, max: 1000 })

// Computed: category options
const categoryOptions = computed(() =>
    categories.value.map((cat) => ({
      label: cat.name,
      value: cat.id
    }))
)

// Computed: filtered products
const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchCategory =
        !selectedCategory.value ||
        p.categories.some((c) => c.id === selectedCategory.value)

    const productPrice = parseFloat(p.prices.price) / 100
    const matchPrice =
        productPrice >= priceRange.value.min &&
        productPrice <= priceRange.value.max

    return matchSearch && matchCategory && matchPrice
  })
})

// Computed: pagination
const totalPages = computed(() => {
  return Math.ceil((filteredProducts.value?.length || 0) / perPage)
})


const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})


// Add to cart handler
const addToCart = (product) => {
  cart.add(product.id, 1)
  console.log('Added to cart:', product.id)
}

// Slug from permalink
const getSlugFromPermalink = (permalink) => {
  return permalink.split('/').filter(Boolean).pop()
}

// Watch price range
watch(priceRange, (val) => {
  console.log('🧪 priceRange changed:', val, 'min:', priceMin.value, 'max:', priceMax.value)
})

// Lifecycle
onMounted(async() => {
      if (process.env.CLIENT) {
        await fetchSeoData()
        await fetchProducts()
        await fetchCategories()
      }
})
</script>

<style scoped>
.my-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
