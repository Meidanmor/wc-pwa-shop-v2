<template>
  <div>
<section class="hero-section-sec">
  <div class="hero-section container hero-margin row">

    <div class="hero-content col-12 col-md-6 q-mb-lg">
      <h1 class="text-h1 text-secondary stable-text">NaturaBloom</h1>
      <p class="text-h6 text-secondary text-weight-light">
        We encompass products that are organic, cruelty-free, and environmentally friendly
      </p>

      <button class="hero-btn q-btn" @click="scrollToProducts">
        <span class="q-focus-helper" tabindex="-1"></span>
        Browse Products
      </button>
    </div>

    <div class="lcp-wrapper col-12 col-md-6">
      <img
        fetchpriority="high"
        loading="eager"
        decoding="async"
        alt="Homepage hero image"
        src="https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png"
        srcset="https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png 300w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-768x512.png 768w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png 1024w"
        sizes="(min-width: 768px) 50vw, 100vw"
        width="300"
        height="200"
        class="hero-img"
      />
    </div>
  </div>
</section>

<!-- Featured Products Slider -->
<section ref="productSection" class="featured-products">
  <div class="container">
    <h2 class="text-h4 text-weight-light text-center q-mb-md">Featured Products</h2>

<div v-if="!isHydrated" class="q-carousel q-panel-parent q-carousel--without-padding q-carousel--navigation-bottom rounded-borders" style="height: 100%;">
  <div class="q-carousel__slides-container">
    <div class="q-panel scroll" role="tabpanel" style="--q-transition-duration: 300ms;">
      <div class="q-carousel__slide">
        <div class="row justify-between">

          <div
            v-for="(product, index) in visibleStaticItems"
            :key="product.id"
            class="col-12 col-sm-6 col-md-4"
            :class="{ 'gt-xs': index === 1, 'gt-sm': index === 2 }"
          >
            <div class="q-card my-card full-height">
              <img
                width="300"
                height="300"
                :src="product.images?.[0]?.src|| ''"
                :srcset="product.images?.[0]?.srcset || ''"
                :sizes="product.images?.[0]?.sizes || ''"
                :alt="product?.name || ''"
              >
              <div class="q-card__section q-card__section--vert">
                <div class="text-h6">{{ product?.name }}</div>
                <div class="text-subtitle2" v-html="product?.price_html"></div>
              </div>
              <div class="q-card__actions justify-start q-card__actions--horiz row">
                <div v-if="!product?.is_in_stock">Out of stock</div>
                <button
                  v-else
                  class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary text-white q-btn--actionable"
                  type="button"
                >
                  <span class="q-btn__content text-center col items-center justify-center row">
                    <span class="block">Add to Cart</span>
                  </span>
                </button>

                <a
                  class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle text-secondary q-btn--actionable"
                  :href="`/product/${getSlugFromPermalink(product?.permalink || '')}`"
                >
                  <span class="q-btn__content text-center col items-center justify-center row">
                    <span class="block">View</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  </div>

  <div class="q-carousel__control absolute absolute-left flex items-center" style="margin: 18px;">
    <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-primary q-btn--dense" type="button">
      <span class="q-btn__content text-center col items-center justify-center row">
        <i class="q-icon"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></i>
      </span>
    </button>
  </div>
  <div class="q-carousel__control absolute absolute-right flex items-center" style="margin: 18px;">
    <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-primary q-btn--dense" type="button">
      <span class="q-btn__content text-center col items-center justify-center row">
        <i class="q-icon"><svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></i>
      </span>
    </button>
  </div>
</div>
    <!-- Interactive carousel AFTER hydration -->
    <q-carousel
        v-else
      :key="carouselKey"
      @touchstart.stop
      @mousedown.stop
      v-model="slide"
      animated
      infinite
      navigation
      swipeable
      :arrows="false"
      height="100%"
      control-color="primary"
      class="rounded-borders"
    >

      <q-carousel-slide
        v-for="(slideGroup, index) in slideChunks"
        :key="`slide-${index}-${slideChunks.length}-${slideGroup.map(p => p.id).join('-')}`"
        :name="index"
      >
        <div class="row justify-between">
          <div
            v-for="fp in slideGroup"
            :key="fp.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <q-card class="my-card full-height">
              <img
                :key="`img-${fp.id}-${fp.images?.[0]?.src || 'noimg'}`"
                width="300"
                height="300"
                :src="fp.images?.[0]?.src"
                :srcset="fp.images?.[0]?.srcset"
                :sizes="fp.images?.[0]?.sizes"
                :alt="fp.name"
              />
              <q-card-section>
                <div class="text-h6">{{ fp.name }}</div>
                <div class="text-subtitle2" v-html="fp.price_html" />
              </q-card-section>
              <q-card-actions>
                <q-btn v-if="fp.is_in_stock" label="Add to Cart" color="primary" @click="addToCart(fp)" />
                <div v-else>Out of stock</div>
                <q-btn
                  label="View"
                  color="secondary"
                  :to="`/product/${getSlugFromPermalink(fp.permalink)}`"
                  flat
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-carousel-slide>

  <!-- Keep the look: bind btnProps, add aria-label, keep visual style -->
  <template #navigation-icon="{ active, btnProps, onClick, index }">
    <q-btn
      v-bind="btnProps"
      :flat="false"
      :color="active ? 'primary' : (btnProps.color || 'grey-5')"
      size="sm"
      :icon="null"
      style="font-size: 5px;padding: 0"
      round
      dense
      :aria-label="`Go to slide ${index + 1}`"
      @click="onClick"
    />
  </template>

  <!-- Custom arrows using q-carousel-control (positions match default) -->
  <template #control>
    <q-carousel-control position="left" class="flex items-center">
      <q-btn
        :icon="matChevronLeft"
        aria-label="Previous slide"
        flat
        round
        dense
        color="primary"
        @click="slide = (Number(slide) - 1 + slideChunks.length) % slideChunks.length"
      />
    </q-carousel-control>

    <q-carousel-control position="right" class="flex items-center">
      <q-btn
        :icon="matChevronRight"
        aria-label="Next slide"
        flat
        round
        dense
        color="primary"
        @click="slide = (Number(slide) + 1) % slideChunks.length"
      />
    </q-carousel-control>
  </template>

    </q-carousel>

  </div>
</section>

    <!-- CTA Section -->
    <section class="cta-section q-pa-md">
      <div class="container">
        <div class="cta-overlay">
          <div class="cta-content">
            <h2 class="text-h4 text-white q-mb-md">Discover Our Full Collection</h2>
            <q-btn
              ref="ctaBtn"
              label="Browse All Products"
              color="primary"
              size="lg"
              to="/products"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section container q-pa-md q-my-xl">
      <h2 class="text-h4 text-weight-light text-center q-mb-lg">What Our Customers Say</h2>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4" v-for="(testimonial, index) in testimonials" :key="index">
          <q-card class="q-pa-md">
            <q-avatar size="56px" class="q-mb-sm">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="#E8F5E9"/>
                <circle cx="40" cy="30" r="12" fill="#81C784"/>
                <path d="M20 60c0-10 9-18 20-18s20 8 20 18H20z" fill="#81C784"/>
              </svg>
            </q-avatar>
            <div class="text-subtitle1 q-mb-sm">{{ testimonial.name }}</div>
            <q-icon :name="matFormatQuote" size="sm" class="text-grey-5" />
            <p class="text-body2">{{ testimonial.feedback }}</p>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Sustainability Section -->
    <section class="sustainability-section container q-pa-md q-my-xl" v-once>
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <img src="https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-300x300.png" srcset="https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1.png 1000w, https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-768x384.png 800w, https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-600x300.png 600w" alt="Sustainability" sizes="100vw" width="946" height="473" loading="lazy" class="full-width" />        </div>
        <div class="col-12 col-md-6">
          <h2 class="text-h4 text-weight-light q-mb-md">Our Commitment to Sustainability</h2>
          <p class="text-body1">
            At NaturaBloom, we prioritize eco-friendly practices, from sourcing organic ingredients to using recyclable packaging.
          </p>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="newsletter-section container q-my-xl text-center">
      <h2 class="text-h4 text-weight-light q-mb-md">Stay Updated</h2>
      <p class="text-body1 q-mb-lg">Subscribe to our newsletter for the latest products and offers.</p>
      <q-input filled v-model="email" label="Your Email" class="subscribe-email-input q-mb-md" />
      <q-btn label="Subscribe" color="primary" @click="subscribeNewsletter" />
    </section>

    <!-- Instagram Feed Section -->
    <section class="instagram-section container q-my-xl" v-once>
      <h2 class="text-h4 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <img width="300" height="300" :src="post.image" :alt="post.caption" class="rounded-borders full-width" />
        </div>
      </div>
    </section>

    <!-- Enhanced About Section -->
    <section class="about-section container q-pa-md q-my-xl" v-once>
      <h2 class="text-h4 text-weight-light q-mb-md">About NaturaBloom</h2>
      <p class="text-body1">
        NaturaBloom blends modern technology with nature's purity, offering organic, cruelty-free, and environmentally friendly products.
      </p>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import cart from 'src/stores/cart'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matChevronLeft, matChevronRight, matFormatQuote } from '@quasar/extras/material-icons'
//import LazySection from 'components/LazySection.vue'
import { defineAsyncComponent } from 'vue'

// Instead of standard imports, do this:
const QCarousel = defineAsyncComponent(() => import('quasar').then(m => m.QCarousel))
const QCarouselSlide = defineAsyncComponent(() => import('quasar').then(m => m.QCarouselSlide))
const QCarouselControl = defineAsyncComponent(() => import('quasar').then(m => m.QCarouselControl))


  // Sync data immediately so the static HTML is correct
  if (process.env.CLIENT && window.__PRODUCTS_DATA__) {
    productsStore.products.value = window.__PRODUCTS_DATA__
  }
// ----------------- Scroll -----------------
const scrollToProducts = () => {}
defineExpose({ scrollToProducts })

// ----------------- SEO -----------------

// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const seo = await fetchSeoForPath('homepage')

    // 2. FETCH PRODUCTS (This was missing!)
    await productsStore.preFetchProducts()

    // 2. Prepare the "Lean" data
    // We only need the first 6 for the homepage carousel
    const leanProducts = productsStore.products.value.slice(0, 6)

    if (ssrContext) {
      // Initialize the state object if it doesn't exist
      ssrContext.seoData = seo
      // INJECT PRODUCTS HERE:
      ssrContext.productsData = leanProducts
      ssrContext.heroData = {
        src: 'https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png',
        srcset: 'https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png 300w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-768x512.png 768w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png 1024w',
        sizes: '(min-width: 768px) 50vw, 100vw'
      }
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
      }
    }
  })
}
//const products = productsStore.products
// --- featuredProducts prefilled SSR-safe ---
const featuredProducts = ref(productsStore.products.value.slice(0, 6))
// --- computed version (reactive) ---
const featuredProductsComputed = computed(() => {
  const list = productsStore.products.value
  if (!Array.isArray(list)) return []
  return list.filter(p => p.id).slice(0, 6)
})

// --- fill SSR payload first (if exists) ---
if (import.meta.env.SSR) {
  featuredProducts.value = featuredProductsComputed.value
}

const visibleStaticItems = computed(() => {
  const allProducts = productsStore.products.value || [];
  // If we have products, take 3.
  // If not, return 3 empty objects (we handle the missing properties in the template)
  return allProducts.length >= 3 ? allProducts.slice(0, 3) : [{}, {}, {}];
});

// ----------------- Setup -----------------
const API_BASE = import.meta.env.VITE_API_BASE
const $q = useQuasar()

const slideChunks = ref([])
const slide = ref(0)
const isHydrated = ref(false)
const carouselKey = ref(0)
const productSection = ref(null)
const ctaBtn = ref(null)
const email = ref('')

// Helper: chunk array
const getChunks = (array, size) => {
  if (!Array.isArray(array) || !array.length) return []
  const chunks = []
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size))
  return chunks
}

// UPDATE THIS FUNCTION:
const recomputeSlides = async (forceRemount = false) => {
  // GUARD: If we aren't hydrated, stop. Don't waste CPU cycles.
  if (!isHydrated.value) return

  const list = productsStore.products.value || []
  const items = list.slice(0, 6)
  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  if (forceRemount) carouselKey.value++

  // Directly chunk the data here (this replaces the need for hydrateFeaturedProducts)
  slideChunks.value = getChunks(items, chunkSize)
}

// ----------------- Testimonials & Instagram -----------------
const avatarSVG =
  '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="40" r="40" fill="#E8F5E9"/> <circle cx="40" cy="30" r="12" fill="#81C784"/> <path d="M20 60c0-10 9-18 20-18s20 8 20 18H20z" fill="#81C784"/> </svg>'

const testimonials = ref([
  { name: 'Alice Johnson', feedback: 'NaturaBloom products have transformed my skincare routine!', avatar: avatarSVG },
  { name: 'Mark Thompson', feedback: 'I love the organic ingredients and sustainable packaging.', avatar: avatarSVG },
  { name: 'Sophie Lee', feedback: 'Fast shipping and excellent customer service.', avatar: avatarSVG }
])

const instagramPosts = ref([
  { image: `${API_BASE}/wp-content/uploads/2025/05/procudts-catalog-img.png`, caption: 'Our latest product launch!' },
  { image: `${API_BASE}/wp-content/uploads/2025/05/procudts-catalog-img.png`, caption: 'Behind the scenes at NaturaBloom.' },
  { image: `${API_BASE}/wp-content/uploads/2025/05/procudts-catalog-img.png`, caption: 'Customer favorites this month.' },
  { image: `${API_BASE}/wp-content/uploads/2025/05/procudts-catalog-img.png`, caption: 'Sustainable packaging in action.' }
])

// ----------------- Helpers -----------------
const subscribeNewsletter = () => {
  if (email.value) {
    $q.notify({ type: 'positive', message: 'Subscribed successfully!' })
    email.value = ''
  } else {
    $q.notify({ type: 'negative', message: 'Please enter a valid email.' })
  }
}

const addToCart = (product) => {
  cart.add(product.id, 1)
}

const getSlugFromPermalink = (permalink) =>
  permalink.split('/').filter(Boolean).pop()


// ----------------- Mounted -----------------
onMounted(() => {

isHydrated.value = false
  if (process.env.CLIENT) {
    // If it's a SPA navigation, hydrate immediately for UX
    //const hasSsrData = !!window.__PRODUCTS_DATA__;
   /* if (productsStore.products.value.length > 0 && !hasSsrData) {
      isHydrated.value = true
      recomputeSlides()
      return
    }*/

    // COLD START: Wait for user interaction
    const hydrateOnInteraction = () => {
      if (isHydrated.value) return
      isHydrated.value = true
      recomputeSlides()

      // Cleanup listeners
      window.removeEventListener('scroll', hydrateOnInteraction)
      window.removeEventListener('mousemove', hydrateOnInteraction)
      window.removeEventListener('touchstart', hydrateOnInteraction)
    }

    window.addEventListener('scroll', hydrateOnInteraction, { passive: true })
    window.addEventListener('mousemove', hydrateOnInteraction, { passive: true })
    window.addEventListener('touchstart', hydrateOnInteraction, { passive: true })

    // Safety fallback: Hydrate after 5 seconds if no interaction
    setTimeout(hydrateOnInteraction, 5000)
  }
})

// REPLACE YOUR WATCHERS WITH THIS NESTED VERSION:
watch(() => isHydrated.value, (val) => {
  if (val) {
    // Only now do we care about screen size changes or data updates
    watch([() => productsStore.products.value, () => $q.screen.name], () => {
      recomputeSlides(true)
    })
  }
}, { immediate: true })

</script>

<style scoped>

@keyframes gradientAnimation {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

section.featured-products {
    min-height: 664px;
}

.q-carousel {
    padding-bottom: 30px;
}

div.q-img__loading > svg{
  display: none;
}

.my-card img {
  object-fit: cover;
}

.hero-content button:hover .q-focus-helper:after {
  opacity: 0.15;
}

.pre-animate {
  opacity: 0;
  visibility: hidden;
}

.newsletter-section, .instagram-section, .about-section {
  content-visibility: auto;
}

/* HOMEPAGE DEFFERED CSS */
.cta-section {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  height: 400px;
  margin-bottom: 40px;
  /*padding: 0;*/
}
.cta-section .container {
  height: 100%;
}

.cta-overlay {
  position: relative;
  z-index: 1;
  height: 100%;
  background: linear-gradient(-45deg, #4c6e5d96, var(--q-primary), #4c6e5d96);
  background-size: 600% 600%;
  animation: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 40px 20px;
  overflow: hidden;
}

.cta-overlay:after {
    content: '';
    display: block;
    position: absolute;
    top: unset;
    left: auto;
    width: 400px;
    height: 500px;
    background: url(https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 50px;
    bottom: -30%;
    z-index: -1;
    opacity: 0.5;
    transform: translateY(50%);
}
.cta-overlay:before {
  content: '';
  background: var(--q-primary);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: auto;
  max-width: 200px;
  z-index: -1;
  transition: 1s;
}
.cta-content {
  max-width: 600px;
  margin: 0 auto auto;
  text-align: center;
}

.sustainability-section img {
  aspect-ratio: 946 / 473;
}
@media(max-width: 767px) {
  .hero-content h1.text-h1 {
    font-size: 14vw;
  }

  .hero-section {
    padding: 0px 20px;
  }

}
@media(min-width: 600px) {
  .row.justify-between .col-md-4 {
    width: calc(100% / 2 - 10px);
  }
}
@media(min-width: 1024px) {
  .row.justify-between .col-md-4 {
    width: calc(100% / 3 - 10px);
  }
}

/*.cta-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: linear-gradient(45deg, black, transparent);
  background-size: cover;
  background-position: center;
  filter: brightness(0.6) blur(2px);
  z-index: 0;
}*/

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.cta-overlay.animate-bg {
    animation: gradientShift 10s ease infinite;
}

.hero-section-sec.animate-bg {
    animation: gradientAnimation 25s ease infinite;
}

.about-section {
  max-width: 700px;
}
.testimonials-section q-card {
  transition: transform 0.3s;
}
.testimonials-section q-card:hover {
  transform: translateY(-5px);
}
.sustainability-section img {
  border-radius: 8px;
  height: auto;
}
.newsletter-section {
  background-color: #f9f9f9;
  padding: 40px 20px;
  border-radius: 8px;
}
.instagram-section q-img {
  cursor: pointer;
  transition: transform 0.3s;
}
.instagram-section q-img:hover {
  transform: scale(1.05);
}
.about-section {
  max-width: 700px;
  margin: 0 auto;
}
.subscribe-email-input {
  max-width: 500px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

</style>
