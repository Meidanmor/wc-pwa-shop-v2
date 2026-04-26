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

        <div class="col-xs-12 col-md-6"  v-if="!isHydrated || isHydrated && !Array.isArray(categories)">
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

      <div class="q-pa-md q-mb-md" v-if="!isHydrated || isHydrated && !priceMin">
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
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-xs-12 col-sm-6 col-md-4 relative-position"
        >
          <ProductCard :product="product" />
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
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const seo = await fetchSeoForPath('shop')

    // ✅ ALWAYS fetch SEO (lightweight)

    let products = []
    let categories = []
    let priceMeta = null

    if (ssrContext) {

      categories = await api.getCategories()

      let currentCat = categories.find(c => c.slug === currentRoute.params.slug) || null;
      const productsQuery = {
        api: true,
        page: 1,
        per_page: 6,
        category: currentCat ? currentCat.id : null
      }
      // 🟢 ONLY BLOCK SSR
      products = await productsStore.preFetchProducts(productsQuery)
      const res = await fetch(
  currentCat
    ? `https://nuxt.meidanm.com/wp-json/wc/store/v1/products-meta?category=${currentCat.id}`
    : 'https://nuxt.meidanm.com/wp-json/wc/store/v1/products-meta'
      )
      priceMeta = await res.json()


      ssrContext.productsData = products
      ssrContext.categoriesData = categories
      ssrContext.selectedCategoryData = currentCat || null
      ssrContext.ssrQuery = productsQuery || null
      ssrContext.priceMetaData = priceMeta
      ssrContext.productsTotal = productsStore.totalProducts.value
      ssrContext.pagesTotal = productsStore.totalPages.value
    }

    if (ssrContext) {
      ssrContext.seoData = seo
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
const isHydrated = ref(false)
// Watch price range

const isFetching = ref(false)
const pendingPriceRange = ref(null)
if(process.env.SERVER) {
  const ssr = useSSRContext()
  categories.value = ssr.categoriesData
  selectedCategoryOBJ.value = ssr.selectedCategoryData
  selectedCategory.value = [ssr.selectedCategoryData.id]
}

if (process.env.CLIENT) {
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
if (process.env.CLIENT && window.__PRODUCTS_TOTAL__) {
  productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
}
if (process.env.CLIENT && window.__PAGES_TOTAL__) {
  productsStore.totalPages.value = window.__PAGES_TOTAL__
}

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

const hasSSRProducts =
  process.env.CLIENT &&
  Array.isArray(window.__PRODUCTS_DATA__) &&
  window.__PRODUCTS_DATA__.length > 0
// Lifecycle
onMounted(async () => {
  isHydrated.value = true

  // 🟢 Fetch missing data only if needed
  if (!hasSSRProducts) {
    productsStore.products.value = []
    productsStore.preFetchProducts({
      api: true,
      page: 1,
      per_page: perPage
    })
  }

  if (!priceMin.value) {
    await fetchPriceMeta()
    priceRange.value = pendingPriceRange.value
    priceMin.value = pendingPriceRange.value.min
    priceMax.value = pendingPriceRange.value.max
  }

  if (!Array.isArray(categories.value) || !categories.value.length) {
    await fetchCategories()
  }
  if (categorySlug.value && categories.value.length) {
    const cat = categories.value.find(c => c.slug === categorySlug.value)

    if (cat) {
      selectedCategory.value = [cat.id]
      selectedCategoryOBJ.value = cat
    }
  }

  isReady.value = true
})
// Function to recalculate price limits based on a product list

async function fetchPriceMeta(category = null) {
  let url = 'https://nuxt.meidanm.com/wp-json/wc/store/v1/products-meta'

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
