<template>
  <q-page class="q-pa-md">

    <!-- Hero Section -->
    <div class="hero-section q-mb-xl">
      <div class="hero-content container">
        <h1 class="text-h1 q-mb-sm">NaturaBloom</h1>
        <p class="text-h6 text-weight-light">We encompasses products that are organic, cruelty-free, and environmentally friendly</p>
        <q-btn label="Browse Products" color="primary" class="q-mt-md" @click="scrollToProducts" />
      </div>
    </div>

<!-- Featured Products Slider -->
<section ref="productSection" class="featured-products q-my-xl">
  <div class="container">
    <h2 class="text-h3 text-weight-light text-center q-mb-md">Featured Products</h2>

        <!-- Skeleton carousel for SSR -->
<!-- Skeleton carousel: shows while NOT hydrated -->
<q-carousel
    v-if="!isHydrated || slideChunks.length === 0"
  v-model="skeletonSlide"
  animated
  arrows
  navigation
  infinite
  swipeable
  height="550px"
  class="rounded-borders"

>
  <!-- Slide 1 -->
  <q-carousel-slide name="0">
    <div class="row justify-center items-stretch q-col-gutter-md" style="height:100%;">
      <div v-for="i in 3" :key="'s1-'+i" class="col-12 col-sm-6 col-md-4">
        <q-card style="height:100%;">
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
    </div>
  </q-carousel-slide>

  <!-- Slide 2 -->
  <q-carousel-slide name="1">
    <div class="row justify-center items-stretch q-col-gutter-md" style="height:100%;">
      <div v-for="i in 3" :key="'s2-'+i" class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-skeleton height="200px" square />
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
    </div>
  </q-carousel-slide>
</q-carousel>


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
      arrows
      height="550px"
      control-color="primary"
      class="rounded-borders"
    >
      <q-carousel-slide
        v-for="(slideGroup, index) in slideChunks"
        :key="`slide-${index}-${slideChunks.length}-${slideGroup.map(p => p.id).join('-')}`"
        :name="index"
      >
        <div class="row justify-center">
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
                :alt="fp.name"
              />
              <q-card-section>
                <div class="text-h6">{{ fp.name }}</div>
                <div class="text-subtitle2" v-html="fp.price_html" />
              </q-card-section>
              <q-card-actions>
                <q-btn label="Add to Cart" color="primary" @click="addToCart(fp)" />
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
    <section class="cta-section pre-animate">
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
    <section class="testimonials-section container pre-animate q-my-xl">
      <h2 class="text-h3 text-weight-light text-center q-mb-lg">What Our Customers Say</h2>
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
    <section class="sustainability-section container pre-animate q-my-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <img src="https://nuxt.meidanm.com/wp-content/uploads/2022/11/IAYAArtboard-1.png" alt="Sustainability" class="full-width" />
        </div>
        <div class="col-12 col-md-6">
          <h2 class="text-h4 text-weight-light q-mb-md">Our Commitment to Sustainability</h2>
          <p class="text-body1">
            At NaturaBloom, we prioritize eco-friendly practices, from sourcing organic ingredients to using recyclable packaging.
          </p>
        </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="newsletter-section pre-animate container q-my-xl text-center">
      <h2 class="text-h3 text-weight-light q-mb-md">Stay Updated</h2>
      <p class="text-body1 q-mb-lg">Subscribe to our newsletter for the latest products and offers.</p>
      <q-input filled v-model="email" label="Your Email" class="subscribe-email-input q-mb-md" />
      <q-btn label="Subscribe" color="primary" @click="subscribeNewsletter" />
    </section>

    <!-- Instagram Feed Section -->
    <section class="instagram-section pre-animate container q-my-xl">
      <h2 class="text-h3 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <q-img :src="post.image" :alt="post.caption" class="rounded-borders" />
        </div>
      </div>
    </section>

    <!-- Enhanced About Section -->
    <section class="about-section pre-animate container q-my-xl">
      <h2 class="text-h3 text-weight-light text-center q-mb-md">About NaturaBloom</h2>
      <p class="text-body1 text-center">
        NaturaBloom blends modern technology with nature's purity, offering organic, cruelty-free, and environmentally friendly products.
      </p>
    </section>


  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useSSRContext } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/boot/woocommerce'
import cart from 'src/stores/cart'
import { useSeo, fetchSeoForPath } from 'src/composables/useSeo'

let initialSeo = { title: '', description: '' }
let fallbackSeo = { title: 'Loading...', description: '...' }
const skeletonSlide = ref('0')

// --- defineOptions preFetch (hoisted) ---
defineOptions({
  async preFetch(ctx) {
    // Fetch SEO
  console.log('[preFetch] running; typeof window =', typeof window)
  console.log('[preFetch] ctx.ssrContext present?', !!ctx?.ssrContext)

    const seo = await fetchSeoForPath('homepage');
    /*console.time('products fetched');
    const products = await api.getProducts(6).catch(err => { console.error('[preFetch] products error', err); return [] });
    console.timeEnd('products fetched')*/

    /*const [seo, products] = await Promise.all([
      fetchSeoForPath('homepage'),
      api.getProducts(6).catch(err => { console.error('[preFetch] products error', err); return [] })
    ]);*/

  // store minimal POJOs to avoid reactive proxies:
  /*const minimal = (Array.isArray(products) ? products : []).map(p => ({
    id: p?.id ?? null,
    name: p?.name ?? '',
    price_html: p?.price_html ?? '',
    images: p?.images ? p.images : [],
    permalink: p?.permalink ?? ''
  }))*/

    // SSR context
    if (ctx?.ssrContext) {
      ctx.ssrContext.__PRE_FETCH_SEO__ = ctx.ssrContext.__PRE_FETCH_SEO__ || {}
      ctx.ssrContext.__PRE_FETCH_SEO__['homepage'] = seo

      /*ctx.ssrContext.__PRE_FETCH_PRODUCTS__ = ctx.ssrContext.__PRE_FETCH_PRODUCTS__ || {}
      ctx.ssrContext.__PRE_FETCH_PRODUCTS__['homepage'] = products*/

    }
  }
})

// --- PRODUCTS: read/hydrate from global store (boot already performed SSR fetch) ---
let preProducts = []
if (import.meta.env.SSR) {
  try {
    const ssr = useSSRContext()
    initialSeo = ssr.__PRE_FETCH_SEO__?.['homepage'] || initialSeo
    //preProducts = ssr.__PRE_FETCH_PRODUCTS__?.['homepage'] || []
    // Log server-side values (visible in server logs)
    //console.log('[SSR] preProducts:', Array.isArray(preProducts) ? `len=${preProducts.length}` : preProducts)
  } catch (err) {
    console.error(err);
    //preProducts = []
  }
} else if (typeof window !== 'undefined') {
  initialSeo = window.__PRE_FETCH_SEO__?.['homepage'] || initialSeo
  //preProducts = window.__PRE_FETCH_PRODUCTS__?.['homepage'] || []
  //console.log('[Client read window.__PRE_FETCH_PRODUCTS__] preProducts length:', preProducts?.length)
}



const {seoData,fetchSeoData } = useSeo('homepage', initialSeo, fallbackSeo)
// --- determine hadPrefetchedProducts robustly and build initial reactive state ---
// preProducts may be set from SSR or from window transfer above
let hadPrefetchedProducts = !!(preProducts && preProducts.length)
let initialProducts = [];
// Build initialProducts that we'll use to initialize reactive refs.
// Prefer preProducts (SSR), then window.__PRE_FETCH_PRODUCTS__ (client-transfer),
// then DOM-scrape fallback (if server rendered HTML exists but window var is absent).

// DOM fallback: if server rendered HTML exists but neither preProducts nor window var is present,
// scrape the server-rendered cards and build a minimal product object so Vue doesn't remove them on hydration.
/*if ((!initialProducts || !initialProducts.length) && typeof document !== 'undefined') {
  console.log(initialProducts);
  try {
    console.log('using card fqllback');
    const cardEls = Array.from(document.querySelectorAll('.featured-products .my-card'))
    if (cardEls.length) {
      hadPrefetchedProducts = true
      initialProducts = cardEls.map((cardEl, idx) => {
        // name
        const nameEl = cardEl.querySelector('.text-h6')
        const name = nameEl ? nameEl.textContent.trim() : `product-${idx}`

        // price_html (we keep innerHTML so v-html works)
        const priceEl = cardEl.querySelector('.text-subtitle2')
        const price_html = priceEl ? priceEl.innerHTML : ''

        // Try to extract <img src> first (q-img might render an <img>)
        let img = ''
        const imgEl = cardEl.querySelector('.img-url')
        console.log(imgEl);
        if (imgEl) {
          img = imgEl.textContent.trim() || '';
        }

        // If not found, try background-image style on any element inside the card
        if (!img) {
          const elWithBg = Array.from(cardEl.querySelectorAll('*')).find(el => {
            const s = el.getAttribute && el.getAttribute('style')
            return s && s.includes('background-image')
          })
          if (elWithBg) {
            const style = elWithBg.getAttribute('style') || ''
            const m = style.match(/background-image\s*:\s*url\((['"]?)(.*?)\1\)/i)
            if (m && m[2]) img = m[2]
          }
        }

        // permalink: try to find anchor with /product/ in href
        const linkEl = cardEl.querySelector('a[href*="/product/"]')
        const permalink = linkEl ? linkEl.getAttribute('href') : ''

        // make an id so v-for keys are stable (use negative to avoid colliding with real ids)
        const productID = cardEl.querySelector('.p-id')
        const id = productID ? productID.textContent.trim() : -(idx + 1);

        return {
          id,
          name,
          price_html,
          images: img ? [{ src: img }] : [],
          permalink
        }
      })
    }
  } catch (e) {
    // silently continue; we'll fall back to empty arrays
    console.warn('[init] DOM fallback failed', e)
  }
  console.log(initialProducts);
}*/

const products = ref(initialProducts || [])
const featuredProducts = ref((initialProducts?.filter(p => p.id).slice(0, 6)) || [])
const productsLoading = ref(!(preProducts && preProducts.length)) // true if no SSR products

// ----------------- Setup -----------------
const API_BASE = import.meta.env.VITE_API_BASE
const $q = useQuasar()

// ----------------- Products -----------------
// preserve server data; ensure arrays (avoid undefined)
/*const products = ref(initialProducts || [])
const featuredProducts = ref((initialProducts?.filter(p => p.id).slice(0, 6)) || [])*/

// --- utility: chunk products into slides ---
/*function slideChunks(list) {
  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3
  const chunks = []
  for (let i = 0; i < list.length; i += chunkSize) {
    chunks.push(list.slice(i, i + chunkSize))
  }
  return chunks
}*/
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
  // opts.forceRemount: if true, will briefly set slidesReady=false to force full remount
  const forceRemount = !!opts.forceRemount

  // If empty featured list, set empty slides and mark ready
  if (!featuredProducts.value || !featuredProducts.value.length) {
    slideChunks.value = []
    slide.value = 0
    slidesReady.value = true
    //console.log('[computeSlideChunks] no featuredProducts -> slideChunks empty')
    return
  }

  const chunkSize = !isHydrated.value
      ? 1
      : $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  //console.log('[computeSlideChunks] chunkSize:', chunkSize, 'featuredProducts len:', featuredProducts.value.length)

  // optionally force a brief unmount so carousel re-initializes cleanly
  if (forceRemount) {
    slidesReady.value = false
    await nextTick()
  }

  // compute and assign
  slideChunks.value = getChunks(featuredProducts.value, chunkSize)

  // safety: if current slide index out of range -> reset
  if (slide.value >= slideChunks.value.length) {
    slide.value = 0
  }

// bump key to force carousel full remount if we're forcing remount
  if (forceRemount) {
    carouselKey.value += 1
  }


  slidesReady.value = true

  /*console.log('[computeSlideChunks] slideChunks count:', slideChunks.value.length, 'ids per slide:',
      slideChunks.value.map(s => s.map(p => p.id).join(',')))*/
}

// Initial SSR-safe compute (no remount)
computeSlideChunks()

// ----------------- Fetch products client-side if needed -----------------
const fetchProducts = async () => {
  productsLoading.value = true
  try {
    const allProducts = await api.getProducts()
    //console.log('[fetchProducts] allProducts length:', Array.isArray(allProducts) ? allProducts.length : allProducts)
    if (allProducts && Array.isArray(allProducts)) {
      products.value = allProducts
      featuredProducts.value = allProducts.filter(p => p.id).slice(0, 6)
    } else {
      products.value = []
      featuredProducts.value = []
    }
    // Force remount when new products arrive to ensure carousel rebuilds
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

function revealFallback() {
  document.querySelectorAll('.pre-animate').forEach(el => el.classList.remove('pre-animate'))
}

// ----------------- Scroll -----------------
const scrollToProducts = () => {
  if (typeof window !== 'undefined' && productSection.value) {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollToPlugin').then(({ ScrollToPlugin }) => {
        gsap.registerPlugin(ScrollToPlugin)
        gsap.to(window, { duration: 1, scrollTo: { y: productSection.value, offsetY: 80 }, ease: 'power2.out' })
      })
    })
  }
}
defineExpose({ scrollToProducts })
if (process.env.DEV) console.time('SSR hydration')

// ----------------- Mounted -----------------
onMounted(async () => {
  console.timeEnd('SSR hydration')
  // reveal hero immediately
  document.querySelectorAll('.hero-content.pre-animate').forEach(el => el.classList.remove('pre-animate'))

  // If our initial products were created by the DOM-scrape fallback (we used negative ids),
  // fetch the real products from the API now so images and full data get populated.
  const hasPlaceholderIds = Array.isArray(products.value) && products.value.some(p => Number(p.id) < 0)
  if (hasPlaceholderIds) {
    // set loading if you want a spinner; optional
    //productsLoading.value = true
    await fetchProducts() // this will replace products & featuredProducts and computeSlideChunks
    productsLoading.value = false
    // force remount after real data arrives
    await computeSlideChunks({ forceRemount: true })
  } else {
    // normal hydration path: recompute chunks for current screen size
    await computeSlideChunks({ forceRemount: true })
  }

  //console.log('[Hydration] featuredProducts len:', featuredProducts.value.length, 'slideChunks len:', slideChunks.value.length)

  // If we somehow had no products from SSR, fetch them on client
  if (!products.value || !products.value.length) {
    await fetchProducts()
    productsLoading.value = false
    hadPrefetchedProducts = true
  }

  // Ensure SEO is up-to-date on client
  if (!seoData.value.title || !seoData.value.description) {
    await fetchSeoData('homepage')
  }

  // GSAP animations (client-only)
  if (typeof window !== 'undefined') {
    const { gsap } = await import('gsap')
    const { ScrollToPlugin } = await import('gsap/ScrollToPlugin')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

    await nextTick()

    try {
      document.querySelectorAll('.pre-animate').forEach(el => el.classList.remove('pre-animate'))

      const sections = [
        { selector: '.testimonials-section', y: 40 },
        { selector: '.sustainability-section', x: -40 },
        { selector: '.newsletter-section', y: 40 },
        { selector: '.instagram-section', y: 40 },
        { selector: '.about-section', y: 40 }
      ]

      sections.forEach(({ selector, x, y }) => {
        gsap.from(selector, {
          autoAlpha: 0,
          x: x || 0,
          y: y || 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: selector, start: 'top 80%', once: true }
        })
      })

      if (ctaBtn.value?.$el) {
        gsap.from(ctaBtn.value.$el, {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true }
        })
      }
    } catch (err) {
      console.error('GSAP failed, using fallback:', err)
      revealFallback()
    }
  }
})
  // mark hydration
  isHydrated.value = true

// ----------------- Responsive -----------------
watch(() => $q.screen.name, async () => {
  // recompute and force remount to make sure carousel updates correctly on resize
  computeSlideChunks({ forceRemount: true })
})
</script>

<style scoped>
.hero-section {
  background: rgb(243, 236, 226);
  border-radius: 20px;
  padding: 60px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-content h1 {
  overflow-wrap: anywhere;
}

.featured-products-section {
  margin-top: 40px;
}

.cta-section {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  height: 400px;
  margin-bottom: 40px;
  padding: 0;
}
.cta-section .container {
  height: 100%;
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

.cta-overlay {
  position: relative;
  z-index: 1;
  height: 100%;
  background: linear-gradient(-45deg, #4c6e5d96, var(--q-primary), #4c6e5d96);
  background-size: 600% 600%;
  animation: gradientShift 10s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 40px 20px;
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

.about-section {
  text-align: center;
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
.hero-content {
  transition: 0.3s ease;
}
.hero-content.pre-animate {
  transform: translateY(40px);
}

.pre-animate {
  opacity: 0;
  visibility: hidden;
}
@media(max-width: 767px){
  h1 {
    font-size: 40px;
  }
}
</style>
