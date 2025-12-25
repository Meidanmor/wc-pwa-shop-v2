<template>
  <div class="q-pa-md">
    <div class="container">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el label="Products" />
        </q-breadcrumbs>


      <h2>Products</h2>
      <!-- Search and Filter -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-md-6" v-if="!isClient">
          <q-skeleton type="rect" class="q-mb-md"/>
        </div>
        <div class="col-xs-12 col-md-6" v-else>
            <q-input filled v-model="search" label="Search products..." debounce="300" />
        </div>

        <div class="col-xs-12 col-md-6"  v-if="!isClient">
          <q-skeleton type="rect" class="q-mb-md"/>
        </div>

        <div class="col-xs-12 col-md-6" v-else>
          <q-select
            filled
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Filter by category"
            emit-value
            map-options
            clearable
            :dropdown-icon="matArrowDropDown"
            :loading-icon="matAutorenew"
            :clear-icon="matClose"
          />
        </div>

      </div>

      <div class="q-pa-md q-mb-md" v-if="!isClient">
        <q-skeleton type="rect" class="q-mb-md"/>
      </div>

        <q-card
            class="q-pa-md q-mb-md"
            v-else
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
              step="0.01"
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
            :img-src="product.images[0]?.src"
            :src="product.images[0]?.src"
            :srcset="product.images[0]?.srcset"
            :sizes="product.images[0]?.sizes"
            :alt="product.name"
            height="300px"
            width="auto"
            class="rounded-borders"
            />
            <q-card-section>
              <div class="text-h6">{{ product.name }}</div>
              <div class="text-subtitle2" v-html="product.price_html" />
            </q-card-section>
            <q-card-actions>
              <q-btn v-if="product.is_in_stock && product.type !== 'variable'" label="Add to Cart" color="primary" @click="addToCart(product)" />
              <q-btn v-else-if="product.is_in_stock && product.type === 'variable'" :to="`/product/${getSlugFromPermalink(product.permalink)}`" label="Choose options" color="primary" />
              <div v-else>Out of stock</div>
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
      <div v-if="totalPages > 1" class="q-mt-lg flex flex-center">
        <q-pagination
            v-model="currentPage"
            :max="totalPages || 1"
            max-pages="6"
            boundary-numbers
            direction-links
            :icon-prev="matKeyboardArrowLeft"
            :icon-next="matKeyboardArrowRight"
            color="primary"
            @update:model-value="scrollToTop"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useMeta, scroll } from 'quasar'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matKeyboardArrowLeft, matKeyboardArrowRight, matArrowDropDown, matAutorenew, matClose } from '@quasar/extras/material-icons'

const { setVerticalScrollPosition } = scroll

function scrollToTop() {
  // Option A: Smooth scroll using Quasar utility (Best feel)
  // window is the target, 0 is the position, 300 is the duration in ms
  setVerticalScrollPosition(window, 187, 300)

  // Option B: Instant jump (Fastest feel)
  // window.scrollTo(0, 0)
}
// Refs and state
const categories = ref([])
const selectedCategory = ref(null)
const search = ref('')
const currentPage = ref(1)
const perPage = 6

// Fetch SEO data during SSR
// 🟢 Run on SSR only
// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const seo = await fetchSeoForPath('shop')
    if (ssrContext) {
      // Initialize the state object if it doesn't exist
      ssrContext.seoData = seo
    }
  }
})

const seoData = ref({
  title: 'Products',
  description: 'Products description'
});
// This only runs in the browser
if (process.env.CLIENT) {
  if (window.__SEO_DATA__) {
    seoData.value = window.__SEO_DATA__
  }

  useMeta(() => {
    const seo = seoData.value;
    return {
      title: seo?.title || 'NaturaBloom',
      meta: {
        description: {
          name: 'description',
          content: seo?.description || "Let's Bloom Together"
        },
        'og:title': {
          property: 'og:title',
          content: seo?.title || 'NaturaBloom'
        },
        'og:description': {
          property: 'og:description',
          content: seo?.description || "Let's Bloom Together"
        }
      }
    }
  })
}

// Fetch categories
const fetchCategories = async () => {
  categories.value = await api.getCategories()
}
const isServer = import.meta.env.SSR
const isClient = ref(false)

if (isServer) {
  fetchCategories()
}

// Price filter
const priceMin = ref(0)
const priceMax = ref(1000)
const priceRange = ref({ min: 0, max: 1000 })

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Computed: category options
const categoryOptions = computed(() =>
    categories.value.map((cat) => ({
      label: decodeHtml(cat.name),
      value: cat.id
    }))
)

// Computed: filtered products (Synchronous!)
const filteredProducts = computed(() => {
  // Access the value directly from the store
  const allProducts = productsStore.products.value || []

  return allProducts.filter((p) => {
    // 1. Search Match
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())

    // 2. Category Match
    const matchCategory =
        !selectedCategory.value ||
        p.categories?.some((c) => c.id === selectedCategory.value) ||
        p.extensions?.["mpress"]?.default_category?.id === selectedCategory.value ||
        p.extensions?.["mpress"]?.default_category?.slug === selectedCategory.value

    // 3. Price Logic
    const pMin = parseFloat(p.prices?.price_range?.min_amount || p.prices?.price || 0) / 100
    const pMax = parseFloat(p.prices?.price_range?.max_amount || p.prices?.price || 0) / 100

    const filterMin = priceRange.value.min
    const filterMax = priceRange.value.max

    // Overlap check
    const matchPrice = pMin <= filterMax && pMax >= filterMin

    return matchSearch && matchCategory && matchPrice
  })
})

// Computed: pagination
const totalPages = computed(() => {
  return Math.ceil((filteredProducts.value?.length || 0) / perPage)
})


const paginatedProducts = computed(() => {
  // Safety check: if filteredProducts isn't ready, return empty array
  if (!filteredProducts.value) return []
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
    console.log('PWA Shell detected: Fetching SEO data from API...')
    try {
      // Use your existing fetch function
      const data = await fetchSeoForPath(`shop`)
      seoData.value = data
    } catch (e) {
      console.error('PWA SEO fetch failed', e)
    }
  }

  await productsStore.fetchProductsIfNeeded()
// 🚨 NEW FIX: Call the update function immediately after fetching data
  // This sets the correct min/max values for the initial page load.
  updatePriceLimits(productsStore.products.value)

  if (process.env.CLIENT) {
    isClient.value = true;
    await fetchCategories()
  }
})

// Function to recalculate price limits based on a product list
const updatePriceLimits = (productsList) => {
    if (!productsList || productsList.length === 0) return;

    // Filter to see what products are available in this cat/search
    const available = productsList.filter(p => {
        const matchCat = !selectedCategory.value || p.categories.some(c => c.id === selectedCategory.value);
        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
        return matchCat && matchSearch;
    });

    if (available.length === 0) return;

    const prices = available.flatMap(p => [
        parseFloat(p.prices.price_range?.min_amount || p.prices.price) / 100,
        parseFloat(p.prices.price_range?.max_amount || p.prices.price) / 100
    ]);

    const trueMin = Math.floor(Math.min(...prices));
    const trueMax = Math.ceil(Math.max(...prices));

    // Update the slider boundaries
    priceMin.value = trueMin;
    priceMax.value = trueMax;

    // Reset the handle positions to the full width
    priceRange.value = { min: trueMin, max: trueMax };
}

// Watch the selected category and update limits
watch(selectedCategory, async() => {
    await productsStore.fetchProductsIfNeeded()

    // When the category changes, recalculate limits based on the full product set
    updatePriceLimits(productsStore.products.value)
    // Also reset the current page to 1
    currentPage.value = 1
}, { immediate: true }) // immediate: true ensures it runs on initial load if selectedCategory has a default value

// Watch the search filter as well, since it also narrows the possible price range
watch(search, async() => {
    await productsStore.fetchProductsIfNeeded()

    updatePriceLimits(productsStore.products.value)
    currentPage.value = 1
})
</script>

<style scoped>
.my-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
