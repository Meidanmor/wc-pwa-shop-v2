<template>
  <div>

    <!-- Hero Section -->
    <section class="hero-section-sec">
    <div class="hero-section container q-mb-xl row">
      <div class="hero-content pre-animate col-12 col-md-6 q-mb-lg">
        <h1 class="text-h1 text-secondary q-mb-sm">NaturaBloom</h1>
        <p class="text-h6 text-secondary text-weight-light">We encompasses products that are organic, cruelty-free, and environmentally friendly</p>
        <q-btn label="Browse Products" text-color="accent" class="q-mt-sm" @click="scrollToProducts" />
      </div>

      <img
          fetchpriority="high"
          loading="eager"
          alt="Homepage hero image"
          src="https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png"
          srcset="
    https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png 800w,
    https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-768x512.png 600w,
    https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png 200w
  "
          sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 90vw,
         1900px"
          width="1900"
          height="700"
          class="col-12 col-md-6"
      />
    </div>
</section>
<!-- Featured Products Slider -->
<section ref="productSection" class="featured-products">
  <div class="container">
    <h2 class="text-h4 text-weight-light text-center q-mb-md">Featured Products</h2>

        <!-- SKELETON LOADER -->
    <div v-if="!isHydrated || slideChunks.length === 0" class="q-pa-md flex justify-center">
      <div class="row justify-center full-width">

        <!-- Mobile: 1 skeleton -->
        <div
            v-if="$q.screen.lt.sm"
            class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="full-height column">
            <q-skeleton height="300px" square />
            <q-card-section>
              <q-skeleton type="text" width="70%" />
              <q-skeleton type="text" width="40%" />
            </q-card-section>
            <q-card-actions align="right">
              <q-skeleton type="QBtn" />
              <q-skeleton type="QBtn" />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Tablet: 2 skeletons -->
        <div
            v-else-if="$q.screen.lt.md"
            v-for="n in 2"
            :key="'skeleton-tablet-' + n"
            class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="full-height column">
            <q-skeleton height="300px" square />
            <q-card-section>
              <q-skeleton type="text" width="70%" />
              <q-skeleton type="text" width="40%" />
            </q-card-section>
            <q-card-actions align="right">
              <q-skeleton type="QBtn" />
              <q-skeleton type="QBtn" />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Desktop: 3 skeletons -->
        <div
            v-else
            v-for="n in 3"
            :key="'skeleton-desktop-' + n"
            class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="full-height column">
            <q-skeleton height="300px" square />
            <q-card-section>
              <q-skeleton type="text" width="70%" />
              <q-skeleton type="text" width="40%" />
            </q-card-section>
            <q-card-actions align="right">
              <q-skeleton type="QBtn" />
              <q-skeleton type="QBtn" />
            </q-card-actions>
          </q-card>
        </div>
        <!-------->

      </div>
    </div>

    <!-- Interactive carousel AFTER hydration -->
    <q-carousel
      v-else-if="isHydrated && slideChunks.length > 0"
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
              <q-img
                :key="`img-${fp.id}-${fp.images?.[0]?.src || 'noimg'}`"
                width="100%"
                height="300px"
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
        icon="chevron_left"
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
        icon="chevron_right"
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

    <!-- 'No products' banner only when there was NO SSR prefetched data -->
    <q-banner v-else-if="slidesReady && !hadPrefetchedProducts && featuredProducts.length === 0" class="bg-grey-2 text-center q-pa-md">
      No featured products found.
    </q-banner>

    <!-- loading spinner fallback -->
    <div v-else class="q-pa-md flex items-center justify-center">
      <q-spinner color="primary" size="6em" />
    </div>
  </div>
</section>


    <!-- CTA Section -->
    <section class="cta-section  q-pa-md">
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
    <section class="testimonials-section container  q-pa-md q-my-xl">
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
            <q-icon name="format_quote" size="sm" class="text-grey-5" />
            <p class="text-body2">{{ testimonial.feedback }}</p>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Sustainability Section -->
    <section class="sustainability-section container  q-pa-md q-my-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <img src="https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-300x300.png" srcset="https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1.png 800w, https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-768x512.png 600w, https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1-300x300.png 200w" alt="Sustainability" width="946" height="473" loading="lazy" class="full-width" />        </div>
        <div class="col-12 col-md-6">
          <h2 class="text-h4 text-weight-light q-mb-md">Our Commitment to Sustainability</h2>
          <p class="text-body1">
            At NaturaBloom, we prioritize eco-friendly practices, from sourcing organic ingredients to using recyclable packaging.
          </p>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="newsletter-section  container q-my-xl text-center">
      <h2 class="text-h4 text-weight-light q-mb-md">Stay Updated</h2>
      <p class="text-body1 q-mb-lg">Subscribe to our newsletter for the latest products and offers.</p>
      <q-input filled v-model="email" label="Your Email" class="subscribe-email-input q-mb-md" />
      <q-btn label="Subscribe" color="primary" @click="subscribeNewsletter" />
    </section>

    <!-- Instagram Feed Section -->
    <section class="instagram-section  container q-my-xl">
      <h2 class="text-h4 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <q-img :src="post.image" :alt="post.caption" class="rounded-borders" />
        </div>
      </div>
    </section>

    <!-- Enhanced About Section -->
    <section class="about-section  container q-pa-md q-my-xl">
      <h2 class="text-h4 text-weight-light q-mb-md">About NaturaBloom</h2>
      <p class="text-body1">
        NaturaBloom blends modern technology with nature's purity, offering organic, cruelty-free, and environmentally friendly products.
      </p>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useSSRContext } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useSeo, fetchSeoForPath } from 'src/composables/useSeo'
//import fs from 'fs'
//import path from 'path'

let initialSeo = { title: '', description: '' }
let fallbackSeo = { title: 'Loading...', description: '...' }

// --- defineOptions preFetch (hoisted) ---
defineOptions({
  async preFetch(ctx) {
    // Fetch SEO
    const seo = await fetchSeoForPath('homepage');
    // SSR context
    if (ctx?.ssrContext) {
      ctx.ssrContext.__PRE_FETCH_SEO__ = ctx.ssrContext.__PRE_FETCH_SEO__ || {}
      ctx.ssrContext.__PRE_FETCH_SEO__['homepage'] = seo
    }

    // Prefetch products from products.json (SSR)
        try {
      const res = await fetch('/data/products.json')
      const preProducts = await res.json() || []

      // Make sure SSR context exists
      if (ctx && ctx.ssrContext) {
        ctx.ssrContext.__PRE_FETCH_PRODUCTS__ = preProducts
      } else {
        console.warn('[preFetch products] SSR context not available')
      }

    } catch (err) {
      console.error('[preFetch products]', err)
    }
  }
})

let preProducts = []
if (import.meta.env.SSR) {
  try {
    const ssr = useSSRContext()
    initialSeo = ssr.__PRE_FETCH_SEO__?.['homepage'] || initialSeo
    preProducts = ssr.__PRE_FETCH_PRODUCTS__ || []
  } catch (err) {
    console.error(err)
  }
}

const {seoData, fetchSeoData } = useSeo('homepage', initialSeo, fallbackSeo)

const products = ref(preProducts || [])
const featuredProducts = ref((preProducts?.filter(p => p.id).slice(0, 6)) || [])
const productsLoading = ref(!(preProducts && preProducts.length))

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

// computeSlideChunks: SSR -> chunkSize=1, after hydration choose by $q.screen
const computeSlideChunks = async (opts = {}) => {
  const forceRemount = !!opts.forceRemount

  if (!featuredProducts.value || !featuredProducts.value.length) {
    slideChunks.value = []
    slide.value = 0
    slidesReady.value = true
    return
  }

  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  if (forceRemount) {
    slidesReady.value = false
    await nextTick()
  }

  slideChunks.value = getChunks(featuredProducts.value, chunkSize)
  if (slide.value >= slideChunks.value.length) slide.value = 0

  if (forceRemount) carouselKey.value += 1
  slidesReady.value = true
}

// Initial SSR-safe compute (no remount)
computeSlideChunks()

// ----------------- Fetch products client-side -----------------
const fetchProducts = async () => {
  productsLoading.value = true
  try {
    let allProducts = []

    // Option 1: fetch from local products.json
    try {
      const res = await fetch('/data/products.json')
      allProducts = await res.json()
    } catch (err) {
      console.warn('[fetchProducts] fallback to WooCommerce API', err)
      allProducts = await api.getProducts()
    }

    if (allProducts && Array.isArray(allProducts)) {
      products.value = allProducts
      featuredProducts.value = allProducts.filter(p => p.id).slice(0, 6)
    } else {
      products.value = []
      featuredProducts.value = []
    }

    await computeSlideChunks({ forceRemount: true })
    return products.value
  } catch (err) {
    console.error('[fetchProducts]', err)
    products.value = []
    featuredProducts.value = []
    await computeSlideChunks({ forceRemount: true })
    return []
  } finally {
    productsLoading.value = false
  }
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

// ----------------- Scroll -----------------
const scrollToProducts = () => {}
defineExpose({ scrollToProducts })

// ----------------- Mounted -----------------
onMounted(async () => {
  // reveal hero immediately
  document.querySelectorAll('.pre-animate').forEach(el => el.classList.remove('pre-animate'))
  document.querySelector('.hero-section-sec').classList.add('animate-bg');

  // If we somehow had no products from SSR, fetch them on client
  if (!products.value || !products.value.length) {
    await fetchProducts()
  }

  // Ensure SEO is up-to-date on client
  if (!seoData.value.title || !seoData.value.description) {
    fetchSeoData('homepage')
  }

  isHydrated.value = true
})

// ----------------- Responsive -----------------
watch(() => $q.screen.name, async () => {
  computeSlideChunks({ forceRemount: true })
})
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

.hero-section-sec.animate-bg {
  animation: gradientAnimation 25s ease infinite;
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

.hero-content {
  /*transition: 0.3s ease;
  max-width: 1210px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;*/
}

.hero-content button {
  /*font-weight: 800;*/
  /*text-shadow: 1px 1px #ffffff60;*/
  border-radius: 50px;
  padding: 10px 20px;
  color: #fff;
  background: var(--primary-gradient);
}

.hero-content.pre-animate {
  transform: translateY(40px);
}

.hero-section.q-mb-xl> img {
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
</style>
