<template>
  <div class="q-pa-md">
    <div class="container">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el><span v-html="selectedCategoryOBJ?.name"></span></q-breadcrumbs-el>
        </q-breadcrumbs>

      <h2 v-html="selectedCategoryOBJ?.name || 'Products'"></h2>
      <!-- Search and Filter -->
      <div class="row q-col-gutter-md q-mb-md">
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
              color="primary"
              :step="0.01"
              @change="onPriceChange"
          />
        </q-card>

      <!-- Total Products -->
      <div v-if="totalProducts" class="text-subtitle1 q-mb-sm">
        Found {{ totalProducts || 0 }} product{{ totalProducts === 1 ? '' : 's' }}
      </div>

      <div v-if="productsStore.productsLoading.value && isHydrated" class="row q-col-gutter-md">
  <div
    v-for="n in 6"
    :key="'skeleton-' + n"
    class="col-xs-12 col-sm-6 col-md-4"
  >
    <q-card class="my-card full-height">

      <!-- Image skeleton -->
      <q-skeleton height="300px" square />

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
      <div v-else-if="paginatedProducts.length" class="row q-col-gutter-md">
        <!-- Product Grid -->
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-xs-12 col-sm-6 col-md-4 relative-position"
        >
          <div class="item-loop-wl absolute">
              <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-if="cart.state.wishlist_items && Object.values(cart.state.wishlist_items).find(obj => product.id === obj.id)" @click="addToWishlist(product.id)" color="accent" :icon="matFavorite" />
              <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-else @click="addToWishlist(product.id)" color="accent" :icon="matFavoriteBorder" />
          </div>

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
              <div v-if="product.status && product.status === 'draft'"><b>This is a draft product. It's shown for admins only!</b></div>
              <q-btn v-else-if="product.is_in_stock && product.type !== 'variable'" label="Add to Cart" color="primary" @click="addToCart(product)" />
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
      <!-- Empty -->
      <div v-else class="text-center q-mt-lg">
        No products found
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
import { ref, computed, onMounted, watch, useSSRContext } from 'vue'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useQuasar, useMeta, scroll } from 'quasar'
import { useRoute } from 'vue-router'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matKeyboardArrowLeft, matKeyboardArrowRight, matArrowDropDown, matAutorenew, matClose, matFavorite, matFavoriteBorder } from '@quasar/extras/material-icons'

const $q = useQuasar()
const { setVerticalScrollPosition } = scroll

async function addToWishlist(objID = 0) {
  await cart.toggleWishlistItem(objID, $q);
}

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
const selectedCategoryOBJ = ref({})
const search = ref('')
const currentPage = ref(1)
const perPage = 6
const route = useRoute()
const categorySlug = ref(route.params.slug || null)

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
  selectedCategory.value = ssr.selectedCategoryData.id
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

  selectedCategory.value = selectedCategoryOBJ.value?.id || null

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

// Add to cart handler
const addToCart = (product) => {
  cart.add(product.id, 1)
  console.log('Added to cart:', product.id)
}

// Slug from permalink
const getSlugFromPermalink = (permalink) => {
  return permalink.split('/').filter(Boolean).pop()
}

watch(
  () => ({
    category: selectedCategory.value,
    search: search.value,
    page: currentPage.value,
    priceTrigger: priceChanged.value // ✅ only trigger when user releases slider
  }),
  async (filters, prev) => {
    if (
  !isReady.value ||
  priceRange.value.min === null ||
  priceRange.value.max === null
    ) return
    if (isFetching.value) return

    const categoryChanged = prev && filters.category !== prev.category

    if (categoryChanged) {
      console.log('Category changed → fetching price meta')

      productsStore.productsLoading.value = true
      await fetchPriceMeta(filters.category)

      //return
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

    console.log('Products fetch watcher triggered!!!')
const source = categoryChanged
  ? pendingPriceRange.value
  : priceRange.value

const min = Math.floor(source.min * 100)
const max = Math.ceil(source.max * 100)
    await productsStore.preFetchProducts({
      api: true,
      page: filters.page,
      per_page: perPage,
      min_price: min,
      max_price: max,
      category: filters.category,
      search: filters.search
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
      selectedCategory.value = cat.id
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
      selectedCategory.value = cat.id
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
.my-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
