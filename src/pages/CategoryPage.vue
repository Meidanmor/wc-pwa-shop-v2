<template>
  <div class="q-pa-md">
    <div class="container">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el><span v-html="selectedCategoryOBJ?.name"></span></q-breadcrumbs-el>
        </q-breadcrumbs>

      <h1 v-html="selectedCategoryOBJ?.name || 'Products'"></h1>
      <div class="archive-layout flex no-wrap">
      <div class="filters-wrap flex" :class="{ 'shown': filtersOpen }" >
        <q-btn
  v-if="isHydrated && $q.screen.width <= 767"
  :icon="matClose"
  color="secondary"
  @click="filtersOpen = false"
/>
      <!-- Search and Filter -->
        <div class="col-xs-12 col-md-6" v-if="!isHydrated">
          <q-skeleton type="rect" class="q-mb-md"/>
        </div>
        <div class="col-xs-12 col-md-6" v-else>
            <q-input filled v-model="search" label="Search products..." debounce="300" />
        </div>

        <div class="col-xs-12 col-md-6"  v-if="!isHydrated || !categoryOptions.length">
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
  v-if="isHydrated && $q.screen.width <= 767"
  :icon="matFilterList"
  label="Filters"
  color="secondary"
  @click="filtersOpen = !filtersOpen"
/>
        </div>

      <div v-if="productsStore.productsLoading.value && isHydrated" class="products-inner row q-col-gutter-md">
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
import api from 'src/boot/woocommerce'
import { useQuasar, useMeta, scroll } from 'quasar'
import { useRoute } from 'vue-router'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matKeyboardArrowLeft, matKeyboardArrowRight, matArrowDropDown, matAutorenew, matClose, matFilterList } from '@quasar/extras/material-icons'
import ProductCard from 'src/components/ProductCard.vue'

const $q = useQuasar()
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

const route = useRoute()
const categorySlug = ref(route.params.slug || null)
const selectedCategoryOBJ = ref(null)
// Fetch SEO data during SSR
// 🟢 Run on SSR only
// Inside your Page or Layout
defineOptions({
  async preFetch({ ssrContext, currentRoute }) {
    const API_BASE =
  import.meta.env.SSR
    ? process.env.VITE_API_BASE   // ✅ your server env (Vercel)
    : import.meta.env.VITE_API_BASE // ✅ client env
    const seo = await fetchSeoForPath('shop')

    let categories = []
    let currentCat = null
    let priceMeta = null

    // ✅ Run on BOTH SSR and client-side navigation
    categories = await api.getCategories()
    currentCat = categories.find(c => c.slug === currentRoute.params.slug) || null

    const productsQuery = {
      api: true,
      page: 1,
      per_page: 6,
      category: currentCat ? currentCat.id : null,
      dryRun: true  // ✅ don't touch the store yet
    }

    const priceUrl = currentCat
      ? `${API_BASE}/wp-json/wc/store/v1/products-meta?category=${currentCat.id}`
      : `${API_BASE}/wp-json/wc/store/v1/products-meta`

    // ✅ Run both in parallel for speed
    const [result, priceRes] = await Promise.all([
      productsStore.preFetchProducts(productsQuery),
      fetch(priceUrl).then(r => r.json())
    ])

    priceMeta = priceRes

    if (ssrContext) {
      // SSR: store in context for hydration
      ssrContext.productsData = result.products
      ssrContext.categoriesData = categories
      ssrContext.selectedCategoryData = currentCat || null
      ssrContext.ssrQuery = productsQuery
      ssrContext.priceMetaData = priceMeta
      ssrContext.productsTotal = result.total
      ssrContext.pagesTotal = result.totalPages
      ssrContext.seoData = seo
    } else {
      // ✅ Client-side navigation: populate store directly
      window.__PREFETCH_PRODUCTS__ = result.products
      window.__PREFETCH_TOTAL__ = result.total
      window.__PREFETCH_PAGES__ = result.totalPages
      window.__CATEGORIES_DATA__ = categories
      window.__PRICE_META__ = priceMeta
      window.__SELECTED_CATEGORY_DATA__ = currentCat
    }
  }
})

const seoData = ref({
  title: 'Products',
  description: 'Products description'
});
const isReady = ref(false)
// Price filter
const priceMin = ref(null)
const priceMax = ref(null)
const priceRange = ref({ min: 0, max: 1000 })
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

const isFetching = ref(false)
const pendingPriceRange = ref(null)
if(process.env.SERVER) {
  const ssr = useSSRContext()
  categories.value = ssr.categoriesData
  selectedCategoryOBJ.value = ssr.selectedCategoryData
  selectedCategory.value = [ssr.selectedCategoryData.id]
}

/*if (process.env.CLIENT) {
  // ----------------------------------
  // 1. SEO
  // ----------------------------------
  if (window.__SEO_DATA__) {
    seoData.value = window.__SEO_DATA__
  }

  useMeta(() => {
    const seo = seoData.value
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

  // ----------------------------------
  // 2. Categories (base data)
  // ----------------------------------
  categories.value = Array.isArray(window.__CATEGORIES_DATA__)
    ? window.__CATEGORIES_DATA__
    : []

  const currentCat =
    categories.value.find(c => c.slug === route.params.slug) || null

  // ----------------------------------
  // 3. Selected Category (SSR or fallback)
  // ----------------------------------
  if (
    window.__SELECTED_CATEGORY_DATA__ &&
    window.__SELECTED_CATEGORY_DATA__.slug === route.params.slug
  ) {
    selectedCategoryOBJ.value = window.__SELECTED_CATEGORY_DATA__
  } else {
    selectedCategoryOBJ.value = currentCat
  }

  selectedCategory.value = [selectedCategoryOBJ.value?.id]

  // ----------------------------------
  // 4. Decide: SSR reuse OR fresh fetch
  // ----------------------------------
  const ssrQuery = window.__SSR_QUERY__ || null

  const isSameCategory =
    (ssrQuery?.category || null) === (currentCat?.id || null)

  const hasSSRProducts =
    Array.isArray(window.__PRODUCTS_DATA__) &&
    window.__PRODUCTS_DATA__.length

  // ----------------------------------
  // 5A. SSR MATCH → hydrate everything
  // ----------------------------------
  if (hasSSRProducts && isSameCategory) {
    productsStore.products.value = window.__PRODUCTS_DATA__
    productsStore.initialized.value = true

    if (window.__PRICE_META__) {
      priceMin.value = Number(window.__PRICE_META__.min_price)
      priceMax.value = Number(window.__PRICE_META__.max_price)
      priceRange.value = {
        min: priceMin.value,
        max: priceMax.value
      }
    }
  }

  // ----------------------------------
  // 5B. DIFFERENT CATEGORY → fetch fresh
  // ----------------------------------
  else if (currentCat) {
    productsStore.products.value = []
    productsStore.initialized.value = false
    productsStore.productsLoading.value = true

    // 🔥 run BOTH in parallel
    const pricePromise = fetchPriceMeta(currentCat.id)
    const productsPromise = productsStore.preFetchProducts({
      api: true,
      page: 1,
      per_page: perPage,
      category: currentCat.id
    })

// wait for BOTH (but independently started)
    Promise.all([pricePromise, productsPromise])
        .then(() => {
          // ✅ update price AFTER it arrives
          if (pendingPriceRange.value) {
            priceMin.value = pendingPriceRange.value.min
            priceMax.value = pendingPriceRange.value.max
            priceRange.value = {...pendingPriceRange.value}
          }
        })
        .finally(() => {
          productsStore.productsLoading.value = false
        })
  }

  // ----------------------------------
  // DONE
  // ----------------------------------
  isReady.value = true
}
// ✅ This runs synchronously on setup — before first paint
if (process.env.CLIENT) {
  const isClientNav = !window.__PRODUCTS_DATA__?.length

  if (isClientNav) {
    // Data was already loaded by preFetch into the store
    // Just sync local refs from store
    const cats = productsStore.categoriesData?.value || []
    categories.value = cats
    const currentCat = cats.find(c => c.slug === route.params.slug) || null
    selectedCategoryOBJ.value = currentCat
    selectedCategory.value = currentCat ? [currentCat.id] : []

    if (productsStore.priceMeta?.value) {
      priceMin.value = productsStore.priceMeta.value.min
      priceMax.value = productsStore.priceMeta.value.max
      priceRange.value = { ...productsStore.priceMeta.value }
    }
  }
}*/
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
  const hasSSRProducts =
    Array.isArray(window.__PRODUCTS_DATA__) && window.__PRODUCTS_DATA__.length

  const ssrQuery = window.__SSR_QUERY__ || null
  const currentCat = (window.__CATEGORIES_DATA__ || [])
    .find(c => c.slug === route.params.slug) || null

  // ✅ Check BOTH: data exists AND it belongs to the current category
  const isSameCategory = (ssrQuery?.category || null) === (currentCat?.id || null)
  const isSSRMatch = hasSSRProducts && isSameCategory

  // --- SSR hydration path (correct category) ---
  if (isSSRMatch) {
    categories.value = window.__CATEGORIES_DATA__ || []
    selectedCategoryOBJ.value = window.__SELECTED_CATEGORY_DATA__?.slug === route.params.slug
      ? window.__SELECTED_CATEGORY_DATA__
      : currentCat
    selectedCategory.value = [selectedCategoryOBJ.value?.id]

    productsStore.products.value = window.__PRODUCTS_DATA__
    productsStore.initialized.value = true
    productsStore.productsLoading.value = false

    if (window.__PRICE_META__) {
      priceMin.value = Number(window.__PRICE_META__.min_price)
      priceMax.value = Number(window.__PRICE_META__.max_price)
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }

    if (window.__PRODUCTS_TOTAL__) productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
    if (window.__PAGES_TOTAL__) productsStore.totalPages.value = window.__PAGES_TOTAL__
  }

  // --- Client nav path: preFetch already loaded the correct category ---
  else if (productsStore.initialized.value) {
    categories.value = window.__CATEGORIES_DATA__ || []
    selectedCategoryOBJ.value = currentCat
    selectedCategory.value = currentCat ? [currentCat.id] : []

    if (window.__PRICE_META__) {
      priceMin.value = Number(window.__PRICE_META__.min_price)
      priceMax.value = Number(window.__PRICE_META__.max_price)
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }


  }

  isReady.value = true
}

const paginatedProducts = computed(() => {
  return productsStore.products.value || []
})

// Fetch categories
const fetchCategories = async () => {
  categories.value = await api.getCategories()
}

const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Computed: category options
const categoryOptions = computed(() => {
  if (!Array.isArray(categories.value)) return []

  return categories.value.map((cat) => ({
    label: decodeHtml(cat.name),
    value: cat.id
  }))
})



// Computed: pagination
const totalPages = computed(() => productsStore.totalPages.value)
const totalProducts = computed(() => productsStore.totalProducts.value)
/*if (process.env.CLIENT && window.__PRODUCTS_TOTAL__) {
  productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
}
if (process.env.CLIENT && window.__PAGES_TOTAL__) {
  productsStore.totalPages.value = window.__PAGES_TOTAL__
}*/

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
    /*if (categoryChanged) {
      console.log('Category changed → fetching price meta')

      productsStore.productsLoading.value = true
      await fetchPriceMeta(filters.category)

      //return
    }*/
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
    console.log('Products fetch watcher triggered!!!')
/*const source = categoryChanged
  ? pendingPriceRange.value
  : priceRange.value*/
    const source = priceRange.value

const min = Math.floor(source.min * 100)
const max = Math.ceil(source.max * 100)
    const sortParams = getSortParams(filters.sort)

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

watch(
  () => route.params.slug,
  async (newSlug) => {
    /*// ✅ If slug is gone, we're navigating away — do nothing
    if (!newSlug) return

    // ✅ Also guard against navigating to a non-category route
    if (!route.name?.toString().includes('category')) return
    */
    // ✅ If slug is gone, we're navigating away — do nothing
    categorySlug.value = newSlug

    if (!categories.value.length) {
      await fetchCategories()
    }

    const cat = categories.value.find(c => c.slug === newSlug)

    if (cat) {
      selectedCategory.value = [cat.id]
      selectedCategoryOBJ.value = cat

      // 🔥 FIX STARTS HERE
      productsStore.products.value = []
      productsStore.productsLoading.value = true

      // 1. fetch price meta FIRST
      await fetchPriceMeta(cat.id)

      priceMin.value = pendingPriceRange.value.min
      priceMax.value = pendingPriceRange.value.max
      priceRange.value = { ...pendingPriceRange.value }

      // 2. fetch products AFTER price is ready
      await productsStore.preFetchProducts({
        api: true,
        page: 1,
        per_page: perPage,
        category: cat.id
      })

      productsStore.productsLoading.value = false
    }
  }
)

/*const hasSSRProducts =
  process.env.CLIENT &&
  Array.isArray(window.__PRODUCTS_DATA__) &&
  window.__PRODUCTS_DATA__.length > 0*/
// Lifecycle
// ✅ Fix
onMounted(async () => {
  isHydrated.value = true

  // ✅ Apply category name first — prevents title fallback flash
  if (window.__SELECTED_CATEGORY_DATA__) {
    selectedCategoryOBJ.value = window.__SELECTED_CATEGORY_DATA__
    selectedCategory.value = [window.__SELECTED_CATEGORY_DATA__.id]
  }

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
      category: selectedCategoryOBJ.value?.id || null
    })
  }

  if (!priceMin.value) {
    await fetchPriceMeta(selectedCategoryOBJ.value?.id || null)
    priceMin.value = pendingPriceRange.value.min
    priceMax.value = pendingPriceRange.value.max
    priceRange.value = { ...pendingPriceRange.value }
  }

  if (!Array.isArray(categories.value) || !categories.value.length) {
    await fetchCategories()
  }

  if (!isReady.value) {
    isReady.value = true  // only set if not already set
  }
})
// Function to recalculate price limits based on a product list

async function fetchPriceMeta(category = null) {
  let url = `${import.meta.env.VITE_API_BASE}/wp-json/wc/store/v1/products-meta`

  if (category) {
    url += `?category=${category}`
  }

  const res = await fetch(url)
  const data = await res.json()

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
