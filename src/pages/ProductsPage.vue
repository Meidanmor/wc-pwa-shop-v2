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
            color="primary"
        />
      </div>

    </div>
  </div>
</template>

<script setup async>
import { ref, computed, onMounted, watch } from 'vue'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useMeta } from 'quasar'
import productsStore from 'src/stores/products'

// Refs and state
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

// Fetch categories
const fetchCategories = async () => {
  categories.value = await api.getCategories()
}
const isServer = import.meta.env.SSR
const isClient = ref(false)

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

// Computed: filtered products
const filteredProducts = computed(() => {
  return productsStore.products.value.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchCategory =
        !selectedCategory.value ||
        p.categories.some((c) => c.id === selectedCategory.value) ||
        p.extensions["mpress"].default_category?.id === selectedCategory.value ||
        p.extensions["mpress"].default_category?.slug === selectedCategory.value

    // 🚨 FIX: Determine the TRUE MIN and TRUE MAX price for the product
    const pMin = parseFloat(p.prices.price_range?.min_amount || p.prices.price) / 100
    const pMax = parseFloat(p.prices.price_range?.max_amount || p.prices.price) / 100

    // The product price range (pMin to pMax) must OVERLAP with the selected range (priceRange.min to priceRange.max)
    const filterMin = priceRange.value.min
    const filterMax = priceRange.value.max

    // An overlap exists if:
    // 1. The product's lowest price is LESS THAN or equal to the filter's MAX, AND
    // 2. The product's highest price is GREATER THAN or equal to the filter's MIN
    const matchPrice = pMin <= filterMax && pMax >= filterMin

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
  await productsStore.fetchProductsIfNeeded()
// 🚨 NEW FIX: Call the update function immediately after fetching data
  // This sets the correct min/max values for the initial page load.
  updatePriceLimits(productsStore.products.value)

  if (process.env.CLIENT) {
    isClient.value = true;
    await fetchSeoData()
    await fetchCategories()
  }
})

// Function to recalculate price limits based on a product list
const updatePriceLimits = (productsList) => {
    if (!productsList || productsList.length === 0) {
        priceMin.value = 0;
        priceMax.value = 1000;
        priceRange.value = { min: 0, max: 1000 };
        return;
    }

    // 1. Filter products based on category and search
    const productsInCurrentCategory = productsList.filter(p => {
        const matchCategory =
            !selectedCategory.value ||
            p.categories.some((c) => c.id === selectedCategory.value) ||
            p.extensions["mpress"].default_category?.id === selectedCategory.value ||
            p.extensions["mpress"].default_category?.slug === selectedCategory.value

        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase())

        return matchCategory && matchSearch
    });

    if (productsInCurrentCategory.length === 0) {
        return;
    }

    // Map prices to raw float values
    const pricesMaxList = productsInCurrentCategory.map((p) =>
        parseFloat(
            p.prices.price_range != null
                ? p.prices.price_range.max_amount
                : p.prices.price
        ) / 100
    )

    const pricesMinList = productsInCurrentCategory.map((p) =>
        parseFloat(
            p.prices.price_range != null
                ? p.prices.price_range.min_amount
                : p.prices.price
        ) / 100
    )

    // Find the true minimum and maximum prices
    const trueMin = Math.min(...pricesMinList);
    const trueMax = Math.max(...pricesMaxList);

    // 2. Set the displayed limits to the EXACT min/max price
    // This addresses your requirement to display 30.00 if the lowest price is 30.00.
    priceMin.value = trueMin;
    priceMax.value = trueMax;

    // 3. Conditional Internal Buffer for Single Price Points

    // If the range is zero or near-zero (due to floating point artifacts)
    if (Math.abs(trueMax - trueMin) < 0.0000001) {
        const buffer = 0.000001; // A buffer small enough to not affect display

        // Apply the buffer to the slider's limits. This ensures the slider is usable.
        priceMin.value = trueMin - buffer;
        priceMax.value = trueMax + buffer;
    }

    // 4. Reset the priceRange model to the new bounds
    priceRange.value = {min: priceMin.value, max: priceMax.value}
}

// Watch the selected category and update limits
watch(selectedCategory, () => {
    // When the category changes, recalculate limits based on the full product set
    updatePriceLimits(productsStore.products.value)
    // Also reset the current page to 1
    currentPage.value = 1
}, { immediate: true }) // immediate: true ensures it runs on initial load if selectedCategory has a default value

// Watch the search filter as well, since it also narrows the possible price range
watch(search, () => {
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
