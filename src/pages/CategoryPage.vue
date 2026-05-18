<template>
  <div class="main-wrapper-div">
    <div class="container">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" to="/" />
        <q-breadcrumbs-el label="Products" to="/products" />
        <q-breadcrumbs-el><span v-html="selectedCategoryOBJ?.name"></span></q-breadcrumbs-el>
      </q-breadcrumbs>

      <h1 v-html="selectedCategoryOBJ?.name || 'Products'"></h1>

      <div class="archive-layout flex no-wrap">
        <div class="filters-wrap flex" :class="{ 'shown': filtersOpen }">
          <q-btn
            v-if="isHydrated && $q.screen.width <= 767"
            :icon="matClose"
            color="secondary"
            @click="filtersOpen = false"
          />

          <!-- Search -->
          <div class="col-xs-12 col-md-6" v-if="!isHydrated">
            <q-skeleton type="rect" class="q-mb-md" />
          </div>
          <div class="col-xs-12 col-md-6" v-else>
            <q-input filled v-model="search" label="Search products..." debounce="300" />
          </div>

          <!-- Category filter -->
          <div class="col-xs-12 col-md-6" v-if="!isHydrated || !categoryOptions.length">
            <q-skeleton type="rect" class="q-mb-md" />
          </div>
          <div class="col-xs-12 col-md-6" v-else>
            <q-card class="q-pa-md q-mb-md">
              <div class="text-subtitle1 q-mb-sm">Filter by Category</div>
              <q-option-group
                v-model="selectedCategory"
                :options="categoryOptions"
                type="checkbox"
                color="secondary"
              />
            </q-card>
          </div>

          <!-- Price filter -->
          <div class="q-pa-md q-mb-md" v-if="!priceMin">
            <q-skeleton type="rect" class="q-mb-md" />
          </div>
          <q-card class="price-range-wrap q-pa-md q-mb-md" v-else>
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

          <!-- Loading skeletons -->
          <div v-if="productsStore.productsLoading.value && isHydrated" class="products-inner row q-col-gutter-md">
            <div
              v-for="n in 6"
              :key="'skeleton-' + n"
              class="col-xs-12 col-sm-6 col-md-4"
            >
              <q-card class="my-card full-height">
                <q-skeleton height="250px" square />
                <q-card-section>
                  <q-skeleton type="text" width="70%" />
                  <q-skeleton type="text" width="40%" />
                </q-card-section>
                <q-card-actions class="q-gutter-sm">
                  <q-skeleton type="rect" width="100px" height="36px" />
                  <q-skeleton type="rect" width="70px" height="36px" />
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <!-- Product grid -->
          <div v-else-if="paginatedProducts.length" class="products-inner row q-col-gutter-md">
            <div
              v-for="(product, index) in paginatedProducts"
              :key="product.id"
              class="col-xs-12 col-sm-6 col-md-4 relative-position"
            >
              <ProductCard :product="product" :priority="index < 3" />
            </div>
          </div>

          <!-- Empty state -->
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
import { useQuasar, useMeta, scroll } from 'quasar'
import { useRoute } from 'vue-router'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matKeyboardArrowLeft, matKeyboardArrowRight, matArrowDropDown, matAutorenew, matClose, matFilterList } from '@quasar/extras/material-icons'
import ProductCard from 'src/components/ProductCard.vue'

const $q = useQuasar()
const { setVerticalScrollPosition } = scroll
const route = useRoute()

// ─── Scroll helper ────────────────────────────────────────────────────────────
function scrollToTop() {
  setVerticalScrollPosition(window, 187, 300)
}

// ─── Core state ───────────────────────────────────────────────────────────────
const categorySlug       = ref(route.params.slug || null)
const selectedCategoryOBJ = ref(null)          // ← category-page identifier
const selectedCategory   = ref([])              // ← pre-seeded with current cat id
const search             = ref('')
const currentPage        = ref(1)
const perPage            = 6
const sortBy             = ref('menu_order')
const filtersOpen        = ref(false)
const isReady            = ref(false)
const isFetching         = ref(false)
const priceMin           = ref(null)
const priceMax           = ref(null)
const priceRange         = ref({ min: 0, max: 1000 })
const priceChanged       = ref(0)
const pendingPriceRange  = ref(null)
const seoData            = ref({ title: 'Products', description: 'Products description' })

const sortOptions = [
  { label: 'Default',           value: 'menu_order' },
  { label: 'Newest',            value: 'date_desc'  },
  { label: 'Price: Low to High',value: 'price_asc'  },
  { label: 'Price: High to Low',value: 'price_desc' },
  { label: 'Name: A to Z',      value: 'title_asc'  },
  { label: 'Name: Z to A',      value: 'title_desc' },
  { label: 'Popularity',        value: 'popularity' },
  { label: 'Rating',            value: 'rating'     },
]

// ─── preFetch (SSR + client-nav) ──────────────────────────────────────────────
defineOptions({
  async preFetch({ ssrContext, currentRoute }) {
    console.log(currentRoute.path)
    const seo        = await fetchSeoForPath(`product-category/${currentRoute.params.slug}`)
    const categories = await productsStore.prefetchCategories()
    const currentCat = categories.find(c => c.slug === currentRoute.params.slug) || null

    const productsQuery = {
      api:      true,
      page:     1,
      per_page: 6,
      category: currentCat?.id ?? null,
      dryRun:   true,
    }

    const [result, priceMeta] = await Promise.all([
      productsStore.preFetchProducts(productsQuery),
      productsStore.prefetchPriceMeta(currentCat?.id ?? null),  // ← uses store method, same as ProductsPage
    ])

    if (ssrContext) {
      ssrContext.productsData         = result.products
      ssrContext.categoriesData       = categories
      ssrContext.selectedCategoryData = currentCat
      ssrContext.ssrQuery             = productsQuery
      ssrContext.priceMetaData        = priceMeta
      ssrContext.productsTotal        = result.total
      ssrContext.pagesTotal           = result.totalPages
      ssrContext.seoData              = seo
    } else {
      // Client-side navigation
      window.__PREFETCH_PRODUCTS__       = result.products
      window.__PREFETCH_TOTAL__          = result.total
      window.__PREFETCH_PAGES__          = result.totalPages
      window.__CATEGORIES_DATA__         = categories
      window.__PRICE_META__              = priceMeta
      window.__SELECTED_CATEGORY_DATA__  = currentCat
    }
  }
})

// ─── SSR context hydration ────────────────────────────────────────────────────
// Runs synchronously on the server so the initial render has category data
if (process.env.SERVER) {
  const ssr = useSSRContext()
  if (ssr) {
    productsStore.categories.value = ssr.categoriesData || []
    selectedCategoryOBJ.value      = ssr.selectedCategoryData || null
    selectedCategory.value         = ssr.selectedCategoryData ? [ssr.selectedCategoryData.id] : []
  }
}

// ─── Client hydration ─────────────────────────────────────────────────────────
const isHydrated = ref(
  process.env.CLIENT && (
    productsStore.initialized.value === true ||
    !!(window.__PRODUCTS_DATA__?.length)
  )
)

if (process.env.CLIENT) {
  // SEO
  if (window.__SEO_DATA__) seoData.value = window.__SEO_DATA__

  useMeta(() => {
    const seo = seoData.value
    return {
      title: seo?.title || 'NaturaBloom',
      meta: {
        description:    { name: 'description',      content: seo?.description || "Let's Bloom Together" },
        'og:title':     { property: 'og:title',     content: seo?.title       || 'NaturaBloom'          },
        'og:description':{ property: 'og:description', content: seo?.description || "Let's Bloom Together"},
      },
    }
  })

  const hasSSRProducts = Array.isArray(window.__PRODUCTS_DATA__) && window.__PRODUCTS_DATA__.length
  const ssrQuery       = window.__SSR_QUERY__ || null
  const currentCat     = (window.__CATEGORIES_DATA__ || []).find(c => c.slug === route.params.slug) || null

  // Check that the SSR data was fetched for this specific category
  const isSameCategory = (ssrQuery?.category || null) === (currentCat?.id || null)
  const isSSRMatch     = hasSSRProducts && isSameCategory

  if (isSSRMatch) {
    // ── SSR hydration path ────────────────────────────────────────────────────
    productsStore.categories.value = window.__CATEGORIES_DATA__ || []

    selectedCategoryOBJ.value = window.__SELECTED_CATEGORY_DATA__?.slug === route.params.slug
      ? window.__SELECTED_CATEGORY_DATA__
      : currentCat
    selectedCategory.value = [selectedCategoryOBJ.value?.id]

    productsStore.products.value      = window.__PRODUCTS_DATA__
    productsStore.initialized.value   = true
    productsStore.productsLoading.value = false

    if (window.__PRICE_META__) {
      priceMin.value  = Number(window.__PRICE_META__.min_price)
      priceMax.value  = Number(window.__PRICE_META__.max_price)
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }

    if (window.__PRODUCTS_TOTAL__) productsStore.totalProducts.value = window.__PRODUCTS_TOTAL__
    if (window.__PAGES_TOTAL__)    productsStore.totalPages.value    = window.__PAGES_TOTAL__

  } else if (productsStore.initialized.value) {
    // ── Client-nav path: preFetch already populated the store ─────────────────
    productsStore.categories.value = window.__CATEGORIES_DATA__ || []

    selectedCategoryOBJ.value = currentCat
    selectedCategory.value    = currentCat ? [currentCat.id] : []

    if (window.__PRICE_META__) {
      priceMin.value  = Number(window.__PRICE_META__.min_price)
      priceMax.value  = Number(window.__PRICE_META__.max_price)
      priceRange.value = { min: priceMin.value, max: priceMax.value }
    }
  }

  isReady.value = true
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const paginatedProducts = computed(() => productsStore.products.value || [])
const totalPages        = computed(() => productsStore.totalPages.value)
const totalProducts     = computed(() => productsStore.totalProducts.value)

const decodeHtml = (html) => {
  if (!html) return ''
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const categoryOptions = computed(() => {
  if (!Array.isArray(productsStore.categories.value)) return []
  return productsStore.categories.value.map(cat => ({
    label: decodeHtml(cat.name),
    value: cat.id,
  }))
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function onPriceChange() {
  priceChanged.value++
}

function getSortParams(sort) {
  switch (sort) {
    case 'price_asc':  return { orderby: 'price',      order: 'asc'  }
    case 'price_desc': return { orderby: 'price',      order: 'desc' }
    case 'date_desc':  return { orderby: 'date',       order: 'desc' }
    case 'title_asc':  return { orderby: 'title',      order: 'asc'  }
    case 'title_desc': return { orderby: 'title',      order: 'desc' }
    case 'popularity': return { orderby: 'popularity', order: 'desc' }
    case 'rating':     return { orderby: 'rating',     order: 'desc' }
    default:           return { orderby: 'menu_order', order: 'desc' }
  }
}

// Uses the store method — same pattern as ProductsPage
async function fetchPriceMeta(category = null) {
  const data = await productsStore.prefetchPriceMeta(category)
  pendingPriceRange.value = {
    min: Number(data.min_price),
    max: Number(data.max_price),
  }
  return data
}

// ─── Watcher: filters → fetch products ───────────────────────────────────────
let requestId = 0

watch(
  () => ({
    category:     selectedCategory.value,
    search:       search.value,
    page:         currentPage.value,
    sort:         sortBy.value,
    priceTrigger: priceChanged.value,
  }),
  async (filters, prev) => {
    if (!isReady.value || priceRange.value.min === null || priceRange.value.max === null) return
    if (isFetching.value) return

    const currentRequest = ++requestId

    const categoryChanged =
      prev &&
      JSON.stringify([...filters.category].sort()) !==
      JSON.stringify([...prev.category].sort())

    if (categoryChanged) {
      productsStore.productsLoading.value = true
      await fetchPriceMeta(filters.category)
      priceMin.value   = pendingPriceRange.value.min
      priceMax.value   = pendingPriceRange.value.max
      priceRange.value = { min: pendingPriceRange.value.min, max: pendingPriceRange.value.max }
    }

    if (prev && (filters.search !== prev.search || filters.priceTrigger !== prev.priceTrigger)) {
      if (currentPage.value !== 1) {
        currentPage.value = 1
        return
      }
    }

    isFetching.value = true
    if (currentRequest !== requestId) return

    const source = priceRange.value
    const min    = Math.floor(source.min * 100)
    const max    = Math.ceil(source.max * 100)
    const sortParams = getSortParams(filters.sort)

    await productsStore.preFetchProducts({
      api:      true,
      page:     filters.page,
      per_page: perPage,
      min_price: min,
      max_price: max,
      category: filters.category.length ? filters.category.join(',') : null,
      search:   filters.search,
      ...sortParams,
    })

    if (categoryChanged) {
      priceMin.value   = pendingPriceRange.value.min
      priceMax.value   = pendingPriceRange.value.max
      priceRange.value = pendingPriceRange.value
    }

    isFetching.value = false
  }
)

// ─── Watcher: route slug change (e.g. navigating between categories) ──────────
watch(
  () => route.params.slug,
  async (newSlug) => {
    categorySlug.value = newSlug

    if (!Array.isArray(productsStore.categories.value) || !productsStore.categories.value.length) {
      await productsStore.prefetchCategories()
    }

    const cat = productsStore.categories.value.find(c => c.slug === newSlug)

    if (cat) {
      selectedCategoryOBJ.value = cat
      selectedCategory.value    = [cat.id]

      productsStore.products.value      = []
      productsStore.productsLoading.value = true

      await fetchPriceMeta(cat.id)
      priceMin.value   = pendingPriceRange.value.min
      priceMax.value   = pendingPriceRange.value.max
      priceRange.value = { ...pendingPriceRange.value }

      await productsStore.preFetchProducts({
        api:      true,
        page:     1,
        per_page: perPage,
        category: cat.id,
      })

      productsStore.productsLoading.value = false
    }
  }
)

// ─── onMounted ────────────────────────────────────────────────────────────────
onMounted(async () => {
  isHydrated.value = true

  // Apply category name immediately to prevent title flash
  if (window.__SELECTED_CATEGORY_DATA__) {
    selectedCategoryOBJ.value = window.__SELECTED_CATEGORY_DATA__
    selectedCategory.value    = [window.__SELECTED_CATEGORY_DATA__.id]
  }

  if (window.__PREFETCH_PRODUCTS__) {
    // Client-nav: commit prefetched data now that old page is gone
    productsStore.products.value        = window.__PREFETCH_PRODUCTS__
    productsStore.totalProducts.value   = window.__PREFETCH_TOTAL__
    productsStore.totalPages.value      = window.__PREFETCH_PAGES__
    productsStore.initialized.value     = true
    productsStore.productsLoading.value = false
    window.__PREFETCH_PRODUCTS__ = null
    window.__PREFETCH_TOTAL__    = null
    window.__PREFETCH_PAGES__    = null
  } else if (!productsStore.initialized.value) {
    // Fallback: preFetch didn't run — fetch for this category now
    productsStore.productsLoading.value = true
    await productsStore.preFetchProducts({
      api:      true,
      page:     1,
      per_page: perPage,
      category: selectedCategoryOBJ.value?.id || null,   // ← category identifier
    })
  }

  if (!priceMin.value) {
    await fetchPriceMeta(selectedCategoryOBJ.value?.id || null)  // ← category identifier
    priceMin.value   = pendingPriceRange.value.min
    priceMax.value   = pendingPriceRange.value.max
    priceRange.value = { ...pendingPriceRange.value }
  }

  if (!Array.isArray(productsStore.categories.value) || !productsStore.categories.value.length) {
    await productsStore.prefetchCategories()
  }

  if (!isReady.value) isReady.value = true
})
</script>

<style scoped>
@import 'src/css/product-archive.css';
</style>