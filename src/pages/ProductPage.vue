<template>
  <div class="container" v-if="product">
    <div class="q-pa-md row q-col-gutter-lg">
      <!-- Product Images -->
      <div class="col-12 col-md-6">
        <div v-if="product?.images?.length > 1">
          <q-carousel
              @touchstart.stop
            @mousedown.stop
            animated
            v-model="activeSlide"
            height="400px"
            :navigation="showCarouselControls"
            autoplay
            control-color="white"
            swipeable
            :infinite="showCarouselControls"
            transition-prev="slide-right"
            transition-next="slide-left"
              :navigation-icon="matLens"
          >
            <q-carousel-slide
              v-for="(img, index) in product?.images"
              :key="index"
              :name="index"
              :ratio="1"
              fit="contain"
              :img-src="img.src"
              :src="img.src"
              :srcset="img.srcset"
              :sizes="img.sizes"
              @mousedown="onImageMouseDown"
              @click="onImageClick(index)"
              style="cursor: zoom-in"
            />
              <!-- Keep the look: bind btnProps, add aria-label, keep visual style -->
  <template v-if="showCarouselControls" #navigation-icon="{ name, onClick, btnProps }">
    <q-btn
      v-bind="btnProps"
      :flat="false"
      :color="activeSlide === name ? 'secondary' : 'primary'"
      size="sm"
      :icon="null"
      style="background: var(--q-secondary); font-size: 5px;padding: 0"
      round
      dense
      :aria-label="`Go to slide ${name + 1}`"
      @click="onClick"
    />
  </template>

  <!-- Custom arrows using q-carousel-control (positions match default) -->
  <template v-if="showCarouselControls" #control>
    <q-carousel-control position="left" class="flex items-center">
      <q-btn
        :icon="matChevronLeft"
        aria-label="Previous slide"
        flat
        round
        dense
        color="secondary"
        @click="activeSlide = (Number(activeSlide) - 1 + product?.images.length) % product?.images.length"
      />
    </q-carousel-control>

    <q-carousel-control position="right" class="flex items-center">
      <q-btn
        :icon="matChevronRight"
        aria-label="Next slide"
        flat
        round
        dense
        color="secondary"
        @click="activeSlide = (Number(activeSlide) + 1) % product?.images.length"
      />
    </q-carousel-control>
  </template>

          </q-carousel>
        </div>
        <div v-else>
          <q-img
            :img-src="product.images[0]?.src"
            :src="product.images[0]?.src"
            :srcset="product.images[0]?.srcset"
            :sizes="product.images[0]?.sizes"
            spinner-color="secondary"
            fit="contain"
            style="cursor: zoom-in; max-height: 500px"
  @mousedown="onImageMouseDown"
  @mousemove="onImageMouseMove"
  @click="onImageClick(0)"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div class="col-12 col-md-6">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el :to="`/product-category/${product?.categories[0]?.slug}`"><span v-html="product.categories[0]?.name"></span></q-breadcrumbs-el>
          <q-breadcrumbs-el :label="product?.name" />
        </q-breadcrumbs>

        <h1 class="text-h4 q-mb-sm">{{ product.name }}</h1>

        <!-- Categories -->
        <div class="q-mb-md">
          <router-link
              v-for="cat in product.categories"
              :key="cat.id"
              :to="`/product-category/${cat.slug}`"
          class="no-decoration"
          >
          <q-chip
            color="secondary"
            text-color="white"
            class="category-chip"
            dense
            clickable
          >
              <span v-html="cat.name"></span>
          </q-chip>
          </router-link>
        </div>

        <!-- Price -->
        <div class="q-mb-md">
          <div v-if="selectedVariation">
            <div v-html="selectedVariation.price_html"></div>
          </div>
          <div v-else-if="product" v-html="product.price_html"></div>
        </div>

        <div class="q-mb-md" v-html="product.description"></div>

        <!-- Variations Selection for Variable Product -->
        <div v-if="isVariable" class="q-mb-md">
          <div
            v-for="(attribute) in availableAttributes"
            :key="attribute.id"
            class="q-mb-sm"
          >
            <label class="text-subtitle2 q-mb-xs">{{ attribute.name }}</label>
<q-select
  v-model="selectedVariations[attribute.name]"
  :options="getOptionsWithDisabled(attribute)"
  dense
  :dropdown-icon="matArrowDropDown"
  :clear-icon="matCancel"
  clearable
  :placeholder="`Select a ${attribute.name}`"
  :label="`Select a ${attribute.name}`"
  emit-value
  map-options
  @update:model-value="onVariationChange"
/>
          </div>
          <div v-if="variationError" class="text-negative text-caption q-mt-xs">
            {{ variationError }}
          </div>
        </div>

        <div v-if="product.status && product.status === 'draft'"><b>This is a draft product. It's shown for admins only!</b></div>

        <div v-else-if="product.is_in_stock">
        <!-- Quantity Selector -->
        <div class="row items-center q-mb-md">
          <q-btn flat round :icon="matRemove" @click="decreaseQty" />
          <q-input
            v-model.number="quantity"
            type="number"
            min="1"
            dense
            style="width: 60px; text-align: center"
          />
          <q-btn flat round :icon="matAdd" @click="increaseQty" />
        </div>

        <q-btn
          label="Add to Cart"
          class="q-mr-sm"
          color="secondary"
          :disable="shouldDisableCartButtons"
          @click="addToCartHandler"
          :loading="cart.state.loading.cart"
        >
          <q-tooltip v-if="shouldDisableCartButtons">
            Please select a variation first.
          </q-tooltip>
        </q-btn>

        <q-btn
          label="Quick Checkout"
          color="black"
          to="/checkout"
          class="quick-checkout-btn"
          :disable="shouldDisableCartButtons"
          @click="addToCartHandler"
          :loading="cart.state.loading.quickbuy"
        >
          <q-tooltip v-if="shouldDisableCartButtons">
            Please select a variation first.
          </q-tooltip>
        </q-btn>

        </div>

        <div v-else> Out of stock </div>

       <div class="full-width">
        <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="wishlist.state.loading" v-if="wishlist.state.items && Object.values(wishlist.state.items).find(obj => selectedVariation ? selectedVariation.id : product.id === obj.id)" @click="addToWishlist" color="accent" label="Remove from wishlist" :icon="matFavorite" />
        <q-btn class="text-black q-pa-none text-caption q-mt-sm" flat :loading="wishlist.state.loading" v-else @click="addToWishlist" color="accent" label="Add to wishlist" :icon="matFavoriteBorder" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
<q-dialog v-model="lightbox.open" no-backdrop-dismiss>
  <q-card
    class="bg-black text-white"
    style="max-width: 100vw; max-height: 100vh; overflow: hidden"
  >
    <div
      class="q-pa-md flex flex-center"
      ref="zoomContainer"
      @touchstart="startTouch"
      @touchmove="moveTouch"
      @touchend="endTouch"
      @wheel="wheelZoom"
      @mousedown="startDrag"
      @mousemove="dragging"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      style="overflow: hidden; position: relative; min-width: 80vw; min-height: 70vh"
    >
      <img
        :src="product.images[lightbox.index]?.src"
        :style="zoomStyle"
        ref="zoomImage"
        draggable="false"
        @click.stop
      />

      <!-- Close -->
      <q-btn
        round dense
        :icon="matClose"
        color="white"
        text-color="black"
        class="absolute-top-right q-ma-sm z-top"
        @click="lightbox.open = false"
      />

      <!-- Left arrow -->
      <q-btn
        v-if="product.images.length > 1"
        round dense
        :icon="matChevronLeft"
        color="white"
        text-color="black"
        class="absolute-left q-ma-sm z-top"
        style="top: 50%; transform: translateY(-50%)"
        @click.stop="lightboxNav(-1)"
      />

      <!-- Right arrow -->
      <q-btn
        v-if="product.images.length > 1"
        round dense
        :icon="matChevronRight"
        color="white"
        text-color="black"
        class="absolute-right q-ma-sm z-top"
        style="top: 50%; transform: translateY(-50%)"
        @click.stop="lightboxNav(1)"
      />
    </div>

    <!-- Thumbnail strip -->
    <div
      v-if="product.images.length > 1"
      class="row justify-center q-pa-sm bg-black"
      style="gap: 8px"
    >
      <img
        v-for="(img, index) in product.images"
        :key="index"
        :src="img.thumbnail || img.src"
        @click.stop="lightboxGoTo(index)"
        :style="{
          width: '60px',
          height: '60px',
          objectFit: 'cover',
          cursor: 'pointer',
          border: lightbox.index === index ? '2px solid white' : '2px solid transparent',
          opacity: lightbox.index === index ? '1' : '0.5',
          borderRadius: '4px',
          transition: 'all 0.2s ease'
        }"
      />
    </div>
  </q-card>
</q-dialog>
    <RelatedProductsSlider
      :productId="product.id"
      :categoryId="product.categories[0]?.id"
      :maxVisible="4"
    />
  </div>

  <div v-else-if="product === null" class="q-pa-md flex items-center justify-center">
    <q-spinner color="secondary" size="6em" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, useSSRContext, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { fetchProductById } from 'src/boot/woocommerce.js'
import cart from 'src/stores/cart.js'
import wishlist from 'src/stores/wishlist.js'
import RelatedProductsSlider from 'src/components/RelatedProductsSlider.vue'
import { useQuasar, useMeta } from 'quasar'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import {
  matFavoriteBorder,
  matFavorite,
  matAdd,
  matClose,
  matRemove,
  matLens,
  matArrowDropDown,
  matChevronLeft,
  matChevronRight,
  matCancel
} from '@quasar/extras/material-icons'

const $q = useQuasar()
const route = useRoute()
const product = ref(null)
const activeSlide = ref(0)
const quantity = ref(1)
const getSlugFromPermalink = (permalink) => {
  const match = permalink.match(/product\/([^/]+)\/?$/)
  return match ? match[1] : ''
}

if (process.env.SERVER) {
  const ssrContext = useSSRContext()

  if (ssrContext?.productData) {
    product.value = ssrContext.productData
  }
}
if (process.env.CLIENT) {
  if (window.__PRODUCT_DATA__ && window.__PRODUCT_DATA__.id) {
    const ssrProductSlug = getSlugFromPermalink(window.__PRODUCT_DATA__.permalink)
    if(ssrProductSlug === route.params.slug) {
      product.value = window.__PRODUCT_DATA__
    }
  }
}

const showCarouselControls = computed(() => {
  return product.value.images.length > 1
})


// 🟢 Run on SSR only
// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.params.slug)
    // FETCH DATA: This is the key change
    const seo = await fetchSeoForPath(currentRoute.path)

    //const seo = await fetchSeoForPath(currentRoute.path)
    if (ssrContext) {
      let productData = await productsStore.fetchSingleProduct(currentRoute.params.slug)

// ✅ Normalize categories on SSR
      if (!productData?.categories?.length) {
        productData.categories = [
          productData?.extensions?.mpress?.default_category
        ].filter(Boolean)
      }
      // Initialize the state object if it doesn't exist
      ssrContext.seoData = seo
      ssrContext.productData = productData
    }
  }
})

const seoData = ref(null)

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
      },
      link: [
      {
        rel: 'canonical',
        href: seo?.canonical || window?.location?.href || ''
      }
    ]
    }
  })
}

// Log for debugging
if (process.env.SERVER) {
  console.log('[SSR] ProductPage loaded on server')
}

function getOptionsWithDisabled(attribute) {
  // Get all original options for this attribute
  const allOptions = product.value.attributes
    .find(a => a.name === attribute.name)?.terms.map(t => t.name) || []

  return allOptions.map(opt => ({
    label: opt,
    value: opt,
    disable: !attribute.options.includes(opt)
  }))
}

//const addToCartLoading = ref(false);
const availableAttributes = computed(() => {
  if (!product.value?.attributes) return []

  const attrMap = {}
  for (const attr of product.value.attributes) {
    if (!attrMap[attr.name]) {
      attrMap[attr.name] = {
        name: attr.name,
        id: attr.id,
        allOptions: attr.terms.map(t => t.name)
      }
    }
  }

  const attributeNames = Object.keys(attrMap)

  return attributeNames.map(attrName => {
    const allOptions = attrMap[attrName].allOptions

    const validOptions = allOptions.filter(optionValue => {
      // Build a hypothetical selection with this option chosen
      const hypothetical = { ...selectedVariations.value, [attrName]: optionValue }

      // Check if any variation is compatible with this hypothetical selection
      return product.value.variations.some(variation => {
        return attributeNames.every(name => {
          const selectedVal = hypothetical[name]

          // If this attribute isn't selected yet in hypothetical, skip it
          if (!selectedVal) return true

          const varAttr = variation.attributes.find(a => a.name === name)
          if (!varAttr) return false

          // Wildcard matches anything
          if (varAttr.value === null) return true

          return varAttr.value.toLowerCase() === selectedVal.toLowerCase()
        })
      })
    })

    return {
      name: attrName,
      id: attrMap[attrName].id,
      options: validOptions
    }
  })
})

const lightbox = ref({ open: false, index: 0 })

const zoom = ref({
  scale: 1,
  x: 0,
  y: 0,
  dragging: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0
})

const zoomStyle = computed(() => ({
  transform: `scale(${zoom.value.scale}) translate(${zoom.value.x}px, ${zoom.value.y}px)`,
  transition: zoom.value.dragging ? 'none' : 'transform 0.2s ease',
  maxWidth: '100%',
  maxHeight: '100%',
  touchAction: 'none',
  userSelect: 'none'
}))

function openLightbox(index) {
  lightbox.value.index = index
  lightbox.value.open = true
  zoom.value = {
    scale: 1,
    x: 0,
    y: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  }
}
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)

const mouseDownTime = ref(0)

function onImageMouseDown() {
  mouseDownTime.value = Date.now()
}

function onImageMouseMove(e) {
  const dx = Math.abs(e.clientX - dragStartX.value)
  const dy = Math.abs(e.clientY - dragStartY.value)
  if (dx > 5 || dy > 5) isDragging.value = true
}

function onImageClick(index) {
  const elapsed = Date.now() - mouseDownTime.value
  if (elapsed > 200) return // was a drag, not a click
  openLightbox(index)
}

function lightboxNav(direction) {
  // Reset zoom when navigating
  zoom.value = { scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0 }
  lightbox.value.index = (lightbox.value.index + direction + product.value.images.length) % product.value.images.length
}

function lightboxGoTo(index) {
  zoom.value = { scale: 1, x: 0, y: 0, dragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0 }
  lightbox.value.index = index
}

const openDrawer = ref(true);
function addToCart(e) {
  handleAddToCart(e)
  console.log('Cart:', cart.state)
}
function handleAddToCart(e) {
  if(e && e.target.innerText == 'QUICK CHECKOUT') {
    cart.state.loading.quickbuy = true;
    openDrawer.value = false;

  }
  console.log(e.target.innerText);
  const matchedVariation = product.value.variations.find((variation) => {
    return Object.entries(selectedVariations.value).every(([attrName, selectedValue]) => {
      const attr = variation.attributes.find(a => a.name === attrName);
      if (!attr || selectedValue === null) return false;
      if (attr.value === null) return true;
      return attr.value.toLowerCase() === selectedValue.toLowerCase();
    });
  });

  console.log(matchedVariation);
  if (!matchedVariation) {
    console.log(product.value.id);
    //alert('No matching variation found');
    cart.add(product.value.id, quantity.value, null, null, $q, '', openDrawer.value);
    return;
  }

  const selectedVariationsArray = {};
  selectedVariationsArray.variation = [];
  console.log(selectedVariations.value);

  for (const [key, value] of Object.entries(matchedVariation.attributes)) {
    console.log(key, value)
    let resolvedValue = value.value

    if (resolvedValue === null || resolvedValue === 'null' || !resolvedValue) {
      resolvedValue = selectedVariations.value[value.name] ?? ''
    }

    selectedVariationsArray.variation.push({
      attribute: value.name,
      value: resolvedValue
    })
  }
  console.log(product.value.id + '-' + 1 + '-' + matchedVariation.id + '-' + selectedVariationsArray.variation);
  cart.add(product.value.id, quantity.value, matchedVariation.id, selectedVariationsArray.variation, $q, '', openDrawer.value);
}
function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

async function fetchProduct(slug) {
  let existing = productsStore.products.value.find(p => {
    const pSlug = getSlugFromPermalink(p.permalink)
    return pSlug === slug
  })

  if (existing) {
    product.value = JSON.parse(JSON.stringify(existing))
  } else {
    product.value = await productsStore.fetchSingleProduct(slug)
  }

  if (!product.value) {
    console.error('Product not found:', slug)
    return
  }
}
async function enhanceProduct() {
  if (!product.value) return

  if (!product.value?.categories?.length) {
    product.value.categories = [product.value.extensions?.mpress?.default_category]
  }

  quantity.value = 1
  activeSlide.value = 0
  lightbox.value.open = false

  await resetVariations()
console.log('route.query:', route.query)
console.log('product attributes:', product.value?.attributes)

  // Auto-select from URL query params if present and valid
  const query = route.query
  if (Object.keys(query).length && product.value.attributes) {
    const validAttrNames = product.value.attributes.map(a => a.name)

    for (const [key, value] of Object.entries(query)) {
      if (!validAttrNames.includes(key)) continue

      // Check the value is a valid option for this attribute
      const attr = product.value.attributes.find(a => a.name === key)
      const validOptions = attr?.terms.map(t => t.name.toLowerCase()) || []

      if (validOptions.includes(String(value).toLowerCase())) {
        selectedVariations.value[key] = value
      }
    }

    // Trigger variation matching if we restored any selections
    if (Object.keys(selectedVariations.value).length) {
      await onVariationChange()
    }
  }

  await fetchWishlistData()
}
const isVariable = computed(() => product.value?.type === 'variable')

const selectedVariations = ref({})
const selectedVariation = ref(null)
const variationError = ref('')
const matchedVariation = ref('');
const wishlistAdded = ref(false);
function resetVariations() {
  selectedVariations.value = {}
  variationError.value = ''
  selectedVariation.value = null
}

const shouldDisableCartButtons = computed(() => {
  return isVariable.value && (!selectedVariation.value || selectedVariation.value === 'null')
})
async function fetchWishlistData() {

  await wishlist.fetchWishlistItems();

//console.log(cart.state.items.wishlist);
if(wishlist.state.items && Object.values(wishlist.state.items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id)){
    wishlistAdded.value = true
  } else{
    wishlistAdded.value = false
  }

//console.log(wishlistAdded.value);
 }

async function onVariationChange() {
  // Clear any selected values that are no longer valid
  for (const attr of availableAttributes.value) {
    const currentVal = selectedVariations.value[attr.name]
    if (currentVal && !attr.options.includes(currentVal)) {
      selectedVariations.value[attr.name] = null
    }
  }
  if (!product.value || !product.value.attributes) {
    selectedVariation.value = null
    return
  }

  console.log('Selected Variations:', selectedVariations.value)
  console.log('Available Variations:', product.value.variations)

  console.log(product.value.variations);

  matchedVariation.value = product.value.variations.find((variation) => {
    return Object.entries(selectedVariations.value).every(([attrName, selectedValue]) => {
      const attr = variation.attributes.find(a => a.name === attrName);

      // If attribute not found, mismatch
      if (!attr || selectedValue === null) return false;

      // If variation has no value (null), treat it as a wildcard (match anything)
      if (attr.value === null) return true;

      // Otherwise, compare the selected value (case-insensitive)
      return attr.value.toLowerCase() === selectedValue.toLowerCase();
    });
  });
  console.log(Object.keys(selectedVariations.value).length);

  if (matchedVariation.value) {
    console.log(Object.keys(matchedVariation.value.attributes).length)

    if (Object.keys(matchedVariation.value.attributes).length == Object.keys(selectedVariations.value).length) {
      selectedVariation.value = matchedVariation.value
    }
    variationError.value = ''
  } else {
    selectedVariation.value = null
    variationError.value = 'Please select valid variation options.'
  }


  for (const [key, value] of Object.entries(selectedVariations.value)) {
    console.log(`${key}: ${value}`);
    if (value == null) {
      selectedVariation.value = null
    }
  }

  if (selectedVariation.value && selectedVariation.value.id) {
    selectedVariation.value = await fetchProductById(selectedVariation.value.id);
  }

  // Update URL query params with current selections
  const query = {}
  for (const [key, value] of Object.entries(selectedVariations.value)) {
    if (value) query[key] = value
  }
const url = new URL(window.location.href)
url.search = '' // clear all existing params first
for (const [k, v] of Object.entries(selectedVariations.value)) {
  if (v) url.searchParams.set(k, v)
}
window.history.replaceState({}, '', url.toString())
  console.log(selectedVariation.value);

}

function addToCartHandler(e) {
  if (isVariable.value) {
  console.log(selectedVariation.value);
    if (!selectedVariation.value) {
      variationError.value = 'Please select all variation options.'
      return
    }
    addToCart(e)
  } else {
    addToCart(e)
  }
}

async function addToWishlist() {
if(selectedVariation.value){
  await wishlist.toggleWishlistItem(selectedVariation.value.id, $q);
} else {
  await wishlist.toggleWishlistItem(product.value.id, $q);
}
if(wishlist.state.items) {
  console.log(Object.values(wishlist.state.items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id));

  console.log(cart.state.items);
  console.log(cart.state.items.length);
}

  if (wishlist.state.items && Object.values(wishlist.state.items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id)) {
    wishlistAdded.value = false;
  } else{
    wishlistAdded.value = true;
  }

console.log(selectedVariation.value ? selectedVariation.value.id : product.value.id);
  console.log(wishlistAdded.value);
}
onMounted(async() => {
  if (process.env.CLIENT) {
      // If no SSR data → fetch
  if (!product.value || !product.value.id) {
    await fetchProduct(route.params.slug)
    await enhanceProduct();
  } else {
    enhanceProduct();
  }
    console.log('PWA Shell detected: Fetching SEO data from API...')
    try {
      // Use your existing fetch function
      const data = await fetchSeoForPath(`product/${route.params.slug}`)
      seoData.value = data
    } catch (e) {
      console.error('PWA SEO fetch failed', e)
    }
  }

  /*if (process.env.CLIENT) {
    await fetchWishlistData()
  }*/
})

onBeforeRouteUpdate(async (to) => {
  try {
    await fetchProduct(to.params.slug)

  } catch (e) {
    console.error(e)
  }
})

watch(
  () => route.params.slug,
  async (newSlug, oldSlug) => {
    if (newSlug === oldSlug) return


    selectedVariation.value = null
    selectedVariations.value = {}
    variationError.value = ''
    quantity.value = 1
    activeSlide.value = 0

    //await fetchProduct(newSlug)

    enhanceProduct().catch(console.error)
    fetchSeoForPath(`product/${newSlug}`)
      .then(data => seoData.value = data)
  }
)

const wheelZoom = (e) => {
  e.preventDefault()
  const delta = e.deltaY < 0 ? 0.1 : -0.1
  zoom.value.scale = Math.min(Math.max(1, zoom.value.scale + delta), 4)
}

const startDrag = (e) => {
  zoom.value.dragging = true
  zoom.value.startX = e.clientX
  zoom.value.startY = e.clientY
}

const dragging = (e) => {
  if (!zoom.value.dragging || zoom.value.scale === 1) return
  const dx = e.clientX - zoom.value.startX
  const dy = e.clientY - zoom.value.startY
  zoom.value.x = zoom.value.lastX + dx
  zoom.value.y = zoom.value.lastY + dy
}

const stopDrag = () => {
  zoom.value.dragging = false
  zoom.value.lastX = zoom.value.x
  zoom.value.lastY = zoom.value.y
}

let touchStart = { x: 0, y: 0, dist: 0 }

const startTouch = (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    touchStart.dist = Math.sqrt(dx * dx + dy * dy)
  } else {
    touchStart.x = e.touches[0].clientX
    touchStart.y = e.touches[0].clientY
  }
}

const endTouch = (e) => {
  if (zoom.value.scale > 1) return
  if (e.changedTouches.length === 1) {
    const dx = e.changedTouches[0].clientX - touchStart.x
    const dy = e.changedTouches[0].clientY - touchStart.y
    // Only swipe if horizontal movement is dominant and significant
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      lightboxNav(dx < 0 ? 1 : -1)
    }
  }
}

const moveTouch = (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const scaleChange = dist / touchStart.dist
    zoom.value.scale = Math.min(Math.max(1, scaleChange), 4)
  }
}

</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
}
.category-chip {
  display: inline-flex;
}
</style>
