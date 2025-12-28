<template>
  <div>


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
    <section class="sustainability-section container q-pa-md q-my-xl">
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
    <section class="instagram-section container q-my-xl">
      <h2 class="text-h4 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <img width="300" height="300" :src="post.image" :alt="post.caption" class="rounded-borders full-width" />
        </div>
      </div>
    </section>

    <!-- Enhanced About Section -->
    <section class="about-section container q-pa-md q-my-xl">
      <h2 class="text-h4 text-weight-light q-mb-md">About NaturaBloom</h2>
      <p class="text-body1">
        NaturaBloom blends modern technology with nature's purity, offering organic, cruelty-free, and environmentally friendly products.
      </p>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import cart from 'src/stores/cart'
import { fetchSeoForPath } from 'src/composables/useSeo'
import productsStore from 'src/stores/products'
import { matChevronLeft, matChevronRight, matFormatQuote } from '@quasar/extras/material-icons'

// ----------------- Scroll -----------------
/*const scrollToProducts = () => {}
defineExpose({ scrollToProducts })*/

// ----------------- SEO -----------------

// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const seo = await fetchSeoForPath('homepage')

    // 2. FETCH PRODUCTS (This was missing!)
    await productsStore.preFetchProducts()

    if (ssrContext) {
      // Initialize the state object if it doesn't exist
      ssrContext.seoData = seo
      // INJECT PRODUCTS HERE:
      ssrContext.productsData = productsStore.products.value
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

// --- helper to ensure SPA navigation works ---
const hydrateFeaturedProducts = async () => {
  if (productsStore.initialized.value && productsStore.products.value.length) {
    featuredProducts.value = productsStore.products.value.filter(p => p.id).slice(0, 6)
  } else {
    await productsStore.preFetchProducts()
    featuredProducts.value = productsStore.products.value.filter(p => p.id).slice(0, 6)
  }
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
const slidesReady = ref(false)
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

const recomputeSlides = async (forceRemount = false) => {
  if (!featuredProducts.value.length) {
    slideChunks.value = []
    slide.value = 0
    slidesReady.value = true
    return
  }

  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  if (forceRemount) slidesReady.value = false
  await nextTick()

  slideChunks.value = getChunks(featuredProducts.value, chunkSize)
  if (slide.value >= slideChunks.value.length) slide.value = 0

  if (isHydrated.value && forceRemount) {
    carouselKey.value += 1
  }
  slidesReady.value = true
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
onMounted(async () => {
  // Check if we have injected data from the server
  if (process.env.CLIENT && window.__PRODUCTS_DATA__) {
    productsStore.products.value = window.__PRODUCTS_DATA__
    productsStore.initialized.value = true
  }

  await nextTick();
  isHydrated.value = true;

  // reveal hero immediately
  /*const img = document.querySelector('.hero-img');
  if (img.complete) {
    document.querySelector('.hero-section-sec').classList.add('animate-bg');
    //document.querySelector('.cta-overlay').classList.add('animate-bg');
  } else {
    img.addEventListener('load', () => {
      document.querySelector('.hero-section-sec').classList.add('animate-bg');
      //document.querySelector('.cta-overlay').classList.add('animate-bg');
    });
  }*/


  hydrateFeaturedProducts().then(() => recomputeSlides(false));

  // Move SEO fetch here - NO AWAIT
  if (process.env.CLIENT) {
    fetchSeoForPath('homepage').then(data => {
      seoData.value = data;
    }).catch(e => console.error(e));
  }

})

watch(featuredProducts, () => recomputeSlides(true))
watch(() => $q.screen.name, () => recomputeSlides(true))

</script>

<style scoped>

@keyframes gradientAnimation {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

.hero-section-sec {
  --text: #1e1e1e;
  --muted: #6f6f6f;
  /* richer gradient palette */
  --primary1: #f6f2e7;  /* very light beige */
  --primary2: #e9ddc4;  /* light warm beige */
  --primary3: #d0c1a3;  /* medium beige */
  --primary4: #bfa07c;  /* deeper warm tone */
  --primary5: #a88360;  /* dark accent */
  --card-shadow: 0 12px 40px rgba(16,16,16,0.08);
}
.hero-section-sec {
  position: relative;
    inset: 0;
    background: linear-gradient(270deg, var(--primary1), var(--primary2), var(--primary3), var(--primary4), var(--primary5));
    background-size: 1200% 1200%;
    animation: none;
}

.hero-section-sec:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  top: 0;
  left: 0;
  background: radial-gradient(circle at 20% 30%, rgb(255 255 255) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgb(255 255 255 / 70%) 0%, transparent 60%), radial-gradient(circle at 50% 50%, rgb(255 255 255 / 38%) 0%, #00000000 60%);
  background-size: 200% 200%;
}
.hero-section {
 /* background: rgb(243, 236, 226);*/
  padding: 0px 20px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.hero-content h1 {
  overflow-wrap: anywhere;
  text-indent: -4px;
  font-weight: 600;
  font-size: 4rem;
  line-height: 1;
  margin-top: 0;
}

.hero-content .text-h6 {
  max-width: 400px;
}

.featured-products-section {
  margin-top: 40px;
}

section.featured-products {
    /*min-height: 664px;*/
    min-height: 900px;
}

.q-carousel {
    padding-bottom: 30px;
}

/* Container Lock */
.static-carousel-container {
  position: relative;
  display: flex;
  padding-bottom: 30px;
  align-items: center;
}

/* Dummy Arrows - Positioned exactly like QCarousel controls */
.static-arrow-left, .static-arrow-right {
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 12px;
}
.static-arrow-left { left: 0; }
.static-arrow-right { right: 0; }

/* Product Grid Area */
.static-grid-content {
  width: 100%;
}

/* Image Parity */
.ssr-card-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

/* Dummy Dots */
.static-nav-dots {
  position: absolute;
  bottom: 16px;
  width: 100%;
  left: 0;
}
.dummy-dot {
  width: 0.9em;
  height: 0.9em;
  border-radius: 50%;
  background: #bdbdbd;
  margin: 0 4px;
}
.dummy-dot.active {
  background: var(--q-primary);
}

/* Responsive visibility - load only 1 on mobile */
@media (max-width: 599px) {
  .static-card-wrapper:nth-child(n+2) { display: none; }
}


.my-card img {
  object-fit: cover;
}
.hero-content {
  /*transition: 0.3s ease;
  max-width: 1210px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;*/
}

/* Prevent layout shifts and ensure instant paint */
.lcp-wrapper {
  content-visibility: auto;
  contain-intrinsic-size: 700px;
}

/* Ensure image is painted ASAP */
.hero-img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 4.5/3;
}
div.q-img__loading > svg{
  display: none;
}
/* Replace Quasar button to avoid hydration delay */
/*.hero-btn {
  background-color: transparent;
  border: 2px solid var(--q-accent);
  color: var(--q-accent);
  padding: 10px 22px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.hero-btn:hover {
  background-color: var(--q-accent);
  color: white;
}*/

.hero-content button {
  /*font-weight: 800;*/
  /*text-shadow: 1px 1px #ffffff60;*/
  border-radius: 50px;
  padding: 10px 20px;
  color: #fff;
  background: var(--primary-gradient);
  border: none;
  cursor: pointer;
  position: relative;
}

.hero-content button:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
}

.hero-content button:before {
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.hero-content button:hover .q-focus-helper {
  opacity: 1;
}
.hero-content button:hover .q-focus-helper:after {
  opacity: 0.15;
}



.hero-content.pre-animate {
  transform: translateY(40px);
}

.hero-section .hero-img {
   /* position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 70px);
    object-fit: cover;
    z-index: 0;
    object-position: 59%;*/
  object-fit: contain;
  margin: 0;
  border-radius: 50px;
}

.pre-animate {
  opacity: 0;
  visibility: hidden;
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

/* SSR / Carousel parity helpers */
.featured-products-ssr {
  /* keep visual parity and allow horizontal overflow so SSR looks like the carousel */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 10px; /* match carousel padding-bottom */
}

.ssr-carousel-row {
  display: flex;
  gap: 16px;
  align-items: stretch; /* important — cards fill same height */
  flex-wrap: nowrap;
}

.ssr-col {
  flex: 0 0 calc(100%); /* mobile */
}

/* responsive: match client chunking (1/2/3 columns widths) */
@media (min-width: 600px) {
  .ssr-col { flex: 0 0 calc(50% - 10px); }
}
@media (min-width: 1024px) {
  .ssr-col { flex: 0 0 calc(33.333% - 10px); }
}

/* Card parity with client q-card */
.ssr-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 10px;
  background: white;
  box-shadow: var(--card-shadow, 0 6px 20px rgba(0,0,0,0.04));
  overflow: hidden;
}

/* Reserve image area matching q-img height used in carousel */
.ssr-img-wrap {
  width: 100%;
  flex: 0 0 auto;
  height: 300px; /* MUST match q-img height="300px" */
  display: block;
}
.ssr-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* body and text */
.ssr-card-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;
  flex: 1 1 auto;
}

/* ensure titles wrap the same way */
.ssr-title {
  line-height: 1.2;
  max-height: calc(1.2em * 3); /* cap lines visually similar to client */
  overflow: hidden;
}

/* ensure overall the SSR row height equals client carousel height */
.featured-products-ssr {
  /* Reserve a minimum height for the entire section to avoid any micro-jump */
  min-height: 340px; /* 300px image + paddings — adjust slightly if needed */
}

</style>
