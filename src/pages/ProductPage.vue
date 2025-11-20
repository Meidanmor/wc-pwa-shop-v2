<template>
  <div class="container" v-if="product">
    <div class="q-pa-md row q-col-gutter-lg">
      <!-- Product Images -->
      <div class="col-12 col-md-6">
        <div v-if="product.images.length > 1">
          <q-carousel
              @touchstart.stop
            @mousedown.stop
            animated
            v-model="activeSlide"
            height="400px"
            navigation
            autoplay
            control-color="white"
            swipeable
            infinite
            transition-prev="slide-right"
            transition-next="slide-left"
          >
            <q-carousel-slide
              v-for="(img, index) in product.images"
              :key="index"
              :name="index"
              :ratio="1"
              fit="contain"
              :img-src="img.src"
              :src="img.src"
              :srcset="img.srcset"
              :sizes="img.sizes"
              @click="openLightbox(index)"
              style="cursor: zoom-in"
            />
          </q-carousel>
        </div>
        <div v-else>
          <q-img
            :img-src="product.images[0]?.src"
            :src="product.images[0]?.src"
            :srcset="product.images[0]?.srcset"
            :sizes="product.images[0]?.sizes"
            spinner-color="primary"
            fit="contain"
            style="cursor: zoom-in"
            :ratio="1"
            @click="openLightbox(0)"
          />
        </div>
      </div>

      <!-- Product Details -->
      <div class="col-12 col-md-6">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" to="/" />
          <q-breadcrumbs-el :to="`/product-category/${product.categories[0]?.slug}`"><span v-html="product.categories[0]?.name"></span></q-breadcrumbs-el>
          <q-breadcrumbs-el :label="product?.name" />
        </q-breadcrumbs>

        <h1 class="text-h4 q-mb-sm">{{ product.name }}</h1>

        <!-- Categories -->
        <div class="q-mb-md">
          <router-link
              v-for="cat in product.categories"
              :key="cat.id"
              :to="`/product-category/${cat.slug}`">
          <q-chip
            color="primary"
            text-color="white"
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
              :options="attribute.options"
              dense
              clearable
              emit-value
              map-options
              @update:model-value="onVariationChange"
            />
          </div>
          <div v-if="variationError" class="text-negative text-caption q-mt-xs">
            {{ variationError }}
          </div>
        </div>

        <!-- Quantity Selector -->
        <div v-if="product.is_in_stock" class="row items-center q-mb-md">
          <q-btn flat round icon="remove" @click="decreaseQty" />
          <q-input
            v-model.number="quantity"
            type="number"
            min="1"
            dense
            style="width: 60px; text-align: center"
          />
          <q-btn flat round icon="add" @click="increaseQty" />
        </div>

        <q-btn
          label="Add to Cart"
          class="q-mr-sm"
          v-if="product.is_in_stock"
          color="primary"
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
          v-if="product.is_in_stock"
          color="accent"
          :disable="shouldDisableCartButtons"
          @click="addToCartHandler"
          :loading="cart.state.loading.quickbuy"
        >
          <q-tooltip v-if="shouldDisableCartButtons">
            Please select a variation first.
          </q-tooltip>
        </q-btn>

        <div v-else> Out of stock </div>

       <div class="full-width">
        <q-btn class="q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-if="cart.state.wishlist_items && Object.values(cart.state.wishlist_items).find(obj => selectedVariation ? selectedVariation.id : product.id === obj.id)" @click="addToWishlist" color="accent" label="Remove from wishlist" icon="favorite" />
        <q-btn class="q-pa-none text-caption q-mt-sm" flat :loading="cart.state.loading.wishlist" v-else @click="addToWishlist" color="accent" label="Add to wishlist" icon="favorite_border" />
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <q-dialog v-model="lightbox.open">
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
          style="overflow: hidden; position: relative"
        >
          <img
            :src="product.images[lightbox.index]?.src"
            :style="zoomStyle"
            ref="zoomImage"
            draggable="false"
          />
          <q-btn
            round
            dense
            icon="close"
            color="white"
            text-color="black"
            class="absolute-top-right q-ma-sm z-top"
            @click="lightbox.open = false"
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

  <div v-else class="q-pa-md flex items-center justify-center">
    <q-spinner color="primary" size="6em" />
  </div>
</template>

<script setup async>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById } from 'src/boot/woocommerce.js'
import cart from 'src/stores/cart.js'
import RelatedProductsSlider from 'src/components/RelatedProductsSlider.vue'
import { useQuasar } from 'quasar'
import { useSeo } from 'src/composables/useSeo'

const $q = useQuasar()
const route = useRoute()
const product = ref(null)
const activeSlide = ref(0)
const quantity = ref(1)

const initialSeo = {
  title: 'Product',
  description: 'product page'
}

// Log for debugging
if (process.env.SERVER) {
  console.log('[SSR] ProductPage loaded on server')
}

//const addToCartLoading = ref(false);
const availableAttributes = computed(() => {
  if (!product.value || !product.value.attributes) return []

  const attrMap = {}

  for (const variation of product.value.attributes) {
      if (!attrMap[variation.name]) {
        attrMap[variation.name] = {
          name: variation.name,
          id: variation.id,
          terms: variation.terms,
          options: new Set()
        }
      }
      for (const term of variation.terms) {
          attrMap[variation.name].options.add(term.name)
      }
  }

  return Object.values(attrMap).map(attr => ({
    name: attr.name,
    slug: attr.slug,
    options: Array.from(attr.options)
  }))
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

function addToCart(e) {
  handleAddToCart(e)
  console.log('Cart:', cart.state)
}
function handleAddToCart(e) {
  if(e && e.target.innerText == 'QUICK CHECKOUT') {
    cart.state.loading.quickbuy = true;
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
    cart.add(product.value.id, quantity.value, null, null, $q);
    return;
  }

  const selectedVariationsArray = {};
  selectedVariationsArray.variation = [];
  console.log(selectedVariations.value);

  for (const [key, value] of Object.entries(matchedVariation.attributes)) {
    console.log(key);
    if (!value.value || value.value == null) {
      for (const [key, val] of Object.entries(selectedVariations.value)) {
        if (value.name == key) {
          value.value = val;
        }
      }

      // value.value = selectedVariations.value.name;
    }
    selectedVariationsArray.variation.push({"attribute": value.name, "value": value.value});
  }
  console.log(product.value.id + '-' + 1 + '-' + matchedVariation.id + '-' + selectedVariationsArray.variation);
  cart.add(product.value.id, quantity.value, matchedVariation.id, selectedVariationsArray.variation, $q);
}
function increaseQty() {
  quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

const getSlugFromPermalink = (permalink) => {
  const match = permalink.match(/product\/([^/]+)\/?$/)
  return match ? match[1] : ''
}

async function fetchProduct(slug) {
  const res = await fetch('/data/products.json')
  const products = await res.json()
  product.value = products.find(p => getSlugFromPermalink(p.permalink) === slug)
  console.log('Product Value Before', product.value);

  if(!product.value?.categories.length) {
    product.value.categories = [product.value.extensions["mpress"].default_category]
  }
  console.log('Product Value', product.value);
  quantity.value = 1
  activeSlide.value = 0
  lightbox.value.open = false
  await resetVariations()
  //console.log(products)
  await fetchWishlistData()
}


// 🟢 Run on SSR only
if (process.env.SERVER) {
  await useSeo('', initialSeo);
  try {
  const res = await fetch('/data/products.json')
  const products = await res.json()
  product.value = products.find(p => getSlugFromPermalink(p.permalink) === route.params.slug)

} catch (err) {
  console.error('[SEO Fetch Error]', err)
}

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

  await cart.fetchWishlistItems();

//console.log(cart.state.wishlist_items.wishlist);
if(cart.state.wishlist_items && Object.values(cart.state.wishlist_items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id)){
    wishlistAdded.value = true
  } else{
    wishlistAdded.value = false
  }

//console.log(wishlistAdded.value);
 }

async function onVariationChange() {
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

    if( Object.keys(matchedVariation.value.attributes).length == Object.keys(selectedVariations.value).length ) {
    selectedVariation.value = matchedVariation.value
    }
    variationError.value = ''
  } else {
    selectedVariation.value = null
    variationError.value = 'Please select valid variation options.'
  }


for (const [key, value] of Object.entries(selectedVariations.value)) {
  console.log(`${key}: ${value}`);
  if(value == null){
    selectedVariation.value = null
  }
}

if(selectedVariation.value && selectedVariation.value.id){
selectedVariation.value = await fetchProductById(selectedVariation.value.id);
}

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
  await cart.toggleWishlistItem(selectedVariation.value.id, $q);
} else {
  await cart.toggleWishlistItem(product.value.id, $q);
}
if(cart.state.wishlist_items) {
  console.log(Object.values(cart.state.wishlist_items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id));

  console.log(cart.state.wishlist_items);
  console.log(cart.state.wishlist_items.length);
}

  if (cart.state.wishlist_items && Object.values(cart.state.wishlist_items).find(obj => selectedVariation.value ? selectedVariation.value.id : product.value.id === obj.id)) {
    wishlistAdded.value = false;
  } else{
    wishlistAdded.value = true;
  }

console.log(selectedVariation.value ? selectedVariation.value.id : product.value.id);
  console.log(wishlistAdded.value);
}
onMounted(async() => {
    if (process.env.CLIENT) {
      await useSeo('', initialSeo);
      await fetchProduct(route.params.slug);
      await fetchWishlistData()
    }
})

watch(
  () => route.params.slug,
  async (newSlug, oldSLug) => {
  if(newSlug != oldSLug){
    product.value = '';
    await fetchProduct(newSlug)
    }
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

const moveTouch = (e) => {
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const scaleChange = dist / touchStart.dist
    zoom.value.scale = Math.min(Math.max(1, scaleChange), 4)
  }
}

const endTouch = () => {}
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>
