<template>
  <div class="main-wrapper-div">
    <div class="container">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el label="Products" />
        </q-breadcrumbs>


      <h1>Products</h1>
      <div class="archive-layout flex no-wrap">
      <div class="filters-wrap flex" :class="{ 'shown': filtersOpen }" >
        <q-btn
            class="mobile-only"
  :icon="matClose"
  color="secondary"
  @click="filtersOpen = false"
/>
      <!-- Search and Filter -->
        <div class="col-xs-12 col-md-6">
            <q-input filled v-model="search" label="Search products..." debounce="300" />
        </div>

        <div class="col-xs-12 col-md-6"  v-if="!isHydrated && !categoryOptions.length">
          <q-skeleton type="rect" class="q-mb-md"/>
        </div>

        <div class="col-xs-12 col-md-6" v-else>
          <q-card class="q-pa-md q-mb-md">
            <div class="text-subtitle1 q-mb-sm">
              Filter by Category
            </div>
            <q-option-group
                v-model="selectedCategory"
                :options="categoryOptions"
                type="checkbox"
                color="secondary"
            />
          </q-card>
        </div>

      <div class="q-pa-md q-mb-md" v-if="!priceMin">
        <q-skeleton type="rect" class="q-mb-md"/>
      </div>

        <q-card
            class="price-range-wrap q-pa-md q-mb-md"
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
              color="secondary"
              :step="0.01"
              @change="onPriceChange"
          />
        </q-card>

      </div>

      <div class="products-wrap">
        <div class="flex justify-between q-mb-md total-products">
      <!-- Total Products -->
      <div v-if="totalProducts" class="text-subtitle1 q-mb-sm">
        Found {{ totalProducts || 0 }} product{{ totalProducts === 1 ? '' : 's' }}
      </div>

        </div>

        <div class="flex justify-between q-mb-md sticky">
          <q-select
  filled
  v-model="sortBy"
  label="Sort by"
  emit-value
  map-options
  :options="sortOptions"
  :dropdown-icon="matArrowDropDown"
  :loading-icon="matAutorenew"
  :clear-icon="matClose"
  color="secondary"

/>
          <q-btn
              class="mobile-only"
  :icon="matFilterList"
  label="Filters"
  color="secondary"
  @click="filtersOpen = !filtersOpen"
/>
        </div>

      <div v-if="productsStore.productsLoading.value" class="products-inner row q-col-gutter-md">
  <div
    v-for="n in 6"
    :key="'skeleton-' + n"
    class="col-xs-12 col-sm-6 col-md-4"
  >
    <q-card class="my-card full-height">

      <!-- Image skeleton -->
      <q-skeleton height="250px" square />

      <q-card-section>
        <!-- Title -->
        <q-skeleton type="text" width="70%" />

        <!-- Price -->
        <q-skeleton type="text" width="40%" />
      </q-card-section>

      <q-card-actions class="q-gutter-sm">
        <!-- Buttons -->
        <q-skeleton type="rect" width="100px" height="36px" />
        <q-skeleton type="rect" width="70px" height="36px" />
      </q-card-actions>

    </q-card>
  </div>
</div>
      <div v-else-if="paginatedProducts.length" class="products-inner row q-col-gutter-md">
        <!-- Product Grid -->
        <div
          v-for="(product, index) in paginatedProducts"
          :key="product.id"
          class="col-xs-12 col-sm-6 col-md-4 relative-position"
        >
          <ProductCard :product="product" :priority="index < 3" />
        </div>
      </div>
      <!-- Empty -->
      <div v-else class="text-center q-mt-lg">
        No products found
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="q-mt-lg flex flex-center pagination-btns">
        <q-pagination
            v-model="currentPage"
            :max="totalPages || 1"
            max-pages="6"
            boundary-numbers
            direction-links
            :icon-prev="matKeyboardArrowLeft"
            :icon-next="matKeyboardArrowRight"
            color="secondary"
            @update:model-value="scrollToTop"
        />
      </div>

      </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, useSSRContext } from 'vue'
import { useMeta, scroll } from 'quasar'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matKeyboardArrowLeft, matKeyboardArrowRight, matArrowDropDown, matAutorenew, matClose, matFilterList } from '@quasar/extras/material-icons'
import ProductCard from 'src/components/ProductCard.vue'

const { setVerticalScrollPosition } = scroll

function scrollToTop() {
  // Option A: Smooth scroll using Quasar utility (Best feel)
  // window is the target, 0 is the position, 300 is the duration in ms
  setVerticalScrollPosition(window, 187, 300)

  // Option B: Instant jump (Fastest feel)
  // window.scrollTo(0, 0)
}
// Refs and state
const selectedCategory = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = 6
const sortBy = ref('menu_order')
const filtersOpen = ref(false)
const sortOptions = [
  { label: 'Default', value: 'menu_order' },
  { label: 'Newest', value: 'date_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'title_asc' },
  { label: 'Name: Z to A', value: 'title_desc' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' }
]
// Fetch SEO data during SSR
// 🟢 Run on SSR only
// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const seo = await fetchSeoForPath('shop')

    // ✅ ALWAYS fetch SEO (lightweight)

    let result = []
    let categories = []
    let priceMeta = null

    // 🟢 ONLY BLOCK SSR
    result = await productsStore.preFetchProducts({
      api: true,
      page: 1,
      per_page: 6,
      dryRun: true  // ✅ don't touch the store yet
    })

    categories = await productsStore.prefetchCategories()

    priceMeta = await productsStore.prefetchPriceMeta();

    if (ssrContext) {
      ssrContext.productsData = result.products
      ssrContext.categoriesData = categories
      ssrContext.priceMetaData = priceMeta
      ssrContext.productsTotal = result.total
      ssrContext.pagesTotal = result.totalPages
    } else {
      // ✅ Client-side navigation: populate store directly
      /* productsStore.products.value = products
      productsStore.initialized.value = true
      productsStore.productsLoading.value = false
      window.__CATEGORIES_DATA__ = categories
      window.__PRICE_META__ = priceMeta*/
      // ✅ AFTER: stage the data in a window buffer, don't touch the store yet
      window.__PREFETCH_PRODUCTS__ = result.products
      window.__PREFETCH_TOTAL__ = result.total
      window.__PREFETCH_PAGES__ = result.totalPages
      window.__CATEGORIES_DATA__ = categories
      window.__PRICE_META__ = priceMeta
      // Do NOT set productsStore.products.value here

    }
    productsStore.products.value = result.products
    productsStore.totalProducts.value = result.total
    productsStore.totalPages.value = result.totalPages
    productsStore.productsLoading.value = false
    if (ssrContext) {
      ssrContext.seoData = seo
    }
  }
})

const seoData = ref({
  title: 'Products',
  description: 'Products description'
});

const paginatedProducts = computed(() => {
  return productsStore.products.value || []
})

const isReady = ref(false)
// Price filter
const priceMin = ref(null)
const priceMax = ref(null)
const priceRange = ref({ min: 0, max: 1000 })

if (process.env.SERVER) {
  const ssrContext = useSSRContext()

  if (ssrContext?.priceMetaData) {
    priceMin.value = Number(ssrContext.priceMetaData.min_price) || 0
    priceMax.value = Number(ssrContext.priceMetaData.max_price) || 0

    priceRange.value = {
      min: priceMin.value,
      max: priceMax.value
    }
  }
}

if (process.env.CLIENT) {
  // --- SEO ---
  if (window.__SEO_DATA__) seoData.value = window.__SEO_DATA__

useMeta(() => {
  const seo = seoData.value

  return {
    title: seo?.title || 'NaturaBloom',

    meta: {
      description: {
        name: 'description',
        content: seo?.description || "Let's Bloom Together"
      },

      robots: {
        name: 'robots',
        content: seo?.robots || 'index, follow'
      },

      'og:title': {
        property: 'og:title',
        content: seo?.title || 'NaturaBloom'
      },

      'og:description': {
        property: 'og:description',
        content: seo?.description || "Let's Bloom Together"
      },

      'og:image': {
        property: 'og:image',
        content: seo?.og_image || ''
      }
    },

    link: [
      {
        rel: 'canonical',
        href: seo?.canonical || window?.location?.href || ''
      }
    ]
  }
})
  const hasSSRProducts =
    Array.isArray(window.__PRODUCTS_DATA__) && window.__PRODUCTS_DATA__.length

  // ✅ Check BOTH: data exists AND it belongs to the current category
  const isSSRMatch = hasSSRProducts

  // --- SSR hydration path (correct category) ---
  if (isSSRMatch) {
    productsStore.categories.value = window.__CATEGORIES_DATA__ || []

    productsStore.products.value = window.__PRODUCTS_DATA__
    productsStore.initialized.value = true
    productsStore.productsLoading.value = false

    if (window.__PRICE_META__) {
      priceMin.value = Number(window.__PRICE_META__.min_price) || 0
      priceMax.value = Number(window.__PRICE_META__.max_price) || 0
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }

    if (window.__PRODUCTS_TOTAL__) productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
    if (window.__PAGES_TOTAL__) productsStore.totalPages.value = window.__PAGES_TOTAL__
  }

  // --- Client nav path: preFetch already loaded the correct category ---
  else if (productsStore.initialized.value) {
    productsStore.categories.value = window.__CATEGORIES_DATA__ || []

    if (window.__PRICE_META__) {
      priceMin.value = Number(window.__PRICE_META__.min_price)
      priceMax.value = Number(window.__PRICE_META__.max_price)
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }


  }

  isReady.value = true
}

const decodeHtml = (html = '') => {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}

// Computed: category options
const categoryOptions = computed(() => {
  if (!Array.isArray(productsStore.categories.value)) return []

  return productsStore.categories.value.map((cat) => ({
    label: decodeHtml(cat.name),
    value: cat.id
  }))
})



// Computed: pagination
const totalPages = computed(() => productsStore.totalPages.value)
const totalProducts = computed(() => productsStore.totalProducts.value)
if (process.env.CLIENT && window.__PRODUCTS_TOTAL__) {
  productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
}
if (process.env.CLIENT && window.__PAGES_TOTAL__) {
  productsStore.totalPages.value = window.__PAGES_TOTAL__
}

const priceChanged = ref(0)

function onPriceChange() {
  priceChanged.value++ // trigger watcher manually
}
//const isHydrated = ref(false)
const isHydrated = ref(
  process.env.CLIENT && (
    productsStore.initialized.value === true ||
    !!(window.__PRODUCTS_DATA__?.length)
  )
)
// Watch price range

function getSortParams(sort) {
  switch (sort) {
    case 'price_asc':
      return { orderby: 'price', order: 'asc' }

    case 'price_desc':
      return { orderby: 'price', order: 'desc' }

    case 'date_desc':
      return { orderby: 'date', order: 'desc' }

    case 'title_asc':
      return { orderby: 'title', order: 'asc' }

    case 'title_desc':
      return { orderby: 'title', order: 'desc' }

    case 'popularity':
      return { orderby: 'popularity', order: 'desc' }

    case 'rating':
      return { orderby: 'rating', order: 'desc' }

    default:
      return { orderby: 'menu_order', order: 'desc' }
  }
}

const isFetching = ref(false)
const pendingPriceRange = ref(null)
let requestId = 0
watch(
  () => ({
    category: selectedCategory.value,
    search: search.value,
    page: currentPage.value,
    sort: sortBy.value,
    priceTrigger: priceChanged.value // ✅ only trigger when user releases slider
  }),
  async (filters, prev) => {
    if (
        !isReady.value ||
        priceRange.value.min === null ||
        priceRange.value.max === null
    ) return
    if (isFetching.value) return

    const currentRequest = ++requestId

    const categoryChanged =
        prev &&
        JSON.stringify([...filters.category].sort()) !==
        JSON.stringify([...prev.category].sort())

    if (categoryChanged) {
      productsStore.productsLoading.value = true

      await fetchPriceMeta(filters.category)

      priceMin.value = pendingPriceRange.value.min
      priceMax.value = pendingPriceRange.value.max
      priceRange.value = {
        min: pendingPriceRange.value.min,
        max: pendingPriceRange.value.max
      }
    }

    if (
        prev &&
        (filters.search !== prev.search ||
            filters.priceTrigger !== prev.priceTrigger)
    ) {
      if (currentPage.value !== 1) {
        currentPage.value = 1
        return
      }
    }

    isFetching.value = true
    if (currentRequest !== requestId) return
    const source = priceRange.value

    const min = Math.floor(source.min * 100)
    const max = Math.ceil(source.max * 100)
    const sortParams = getSortParams(filters.sort)
    console.log(sortParams)
    await productsStore.preFetchProducts({
      api: true,
      page: filters.page,
      per_page: perPage,
      min_price: min,
      max_price: max,
      category: filters.category.length
          ? filters.category.join(',')
          : null,
      search: filters.search,
      ...sortParams
    })

    // 4. NOW update UI together 💥
    if (categoryChanged) {
      priceMin.value = pendingPriceRange.value.min
      priceMax.value = pendingPriceRange.value.max
      priceRange.value = pendingPriceRange.value
    }
    isFetching.value = false
  }
)
// Lifecycle
onMounted(async () => {
  isHydrated.value = true

  if (window.__PREFETCH_PRODUCTS__) {
    // ✅ Now safe to commit — old page is already gone
    productsStore.products.value = window.__PREFETCH_PRODUCTS__
    productsStore.totalProducts.value = window.__PREFETCH_TOTAL__
    productsStore.totalPages.value = window.__PREFETCH_PAGES__
    productsStore.initialized.value = true
    productsStore.productsLoading.value = false
    window.__PREFETCH_PRODUCTS__ = null
    window.__PREFETCH_TOTAL__ = null
    window.__PREFETCH_PAGES__ = null
  } else if (!productsStore.initialized.value) {
    // fallback if preFetch didn't run
    productsStore.productsLoading.value = true
    await productsStore.preFetchProducts({
      api: true,
      page: 1,
      per_page: perPage,
    })
  }

  if (!priceMin.value) {
    await fetchPriceMeta()
    priceMin.value = pendingPriceRange.value.min
    priceMax.value = pendingPriceRange.value.max
    priceRange.value = {...pendingPriceRange.value}
  }

  if (!Array.isArray(productsStore.categories.value) || !productsStore.categories.value.length) {
    await productsStore.prefetchCategories()
  }

  if (!isReady.value) {
    isReady.value = true  // only set if not already set
  }

})
// Function to recalculate price limits based on a product list

async function fetchPriceMeta(category = null) {
  const data = await productsStore.prefetchPriceMeta(category)

  // ❗ DON'T update UI yet
  pendingPriceRange.value = {
    min: Number(data.min_price),
    max: Number(data.max_price)
  }

  return data
}
</script>

<style scoped>
@import 'src/css/product-archive.css';
</style>
