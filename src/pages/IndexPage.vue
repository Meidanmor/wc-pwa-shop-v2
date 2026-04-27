<template>
  <div>
<section class="hero-section-sec">
  <div class="hero-section container hero-margin row">

    <div class="hero-content col-12 col-md-6 q-mb-lg">
      <h1 class="text-h1 text-secondary stable-text" v-html="homeSettings?.hero_title"></h1>
      <p class="text-h6 text-secondary text-weight-light">
        Ethically sourced botanical formulations designed to nurture your skin’s natural radiance with high-potency organic ingredients.
      </p>

      <button class="hero-btn q-btn">
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
        src="https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png"
        srcset="https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png 300w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-768x512.png 768w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png 1024w"
        sizes="(min-width: 768px) 50vw, calc(100vw - 40px)"
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
    <h2 class="text-weight-normal q-mb-md" style="color: #1D1C13; font-size: 41px;">Featured Products</h2>
<div v-if="!isHydrated && productsStore.products.value.length" class="q-carousel q-panel-parent q-carousel--without-padding q-carousel--navigation-bottom rounded-borders" style="height: 100%;">
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

            <div v-if="product.__placeholder" class="q-card invisible-card"></div>

            <div v-else class="q-card my-card full-height">
              <img
                  loading="lazy"
                width="300"
                height="250"
                :src="product.images?.[0]?.src|| ''"
                :srcset="product.images?.[0]?.srcset || ''"
                :sizes="product.images?.[0]?.sizes || ''"
                :alt="product?.name || ''"
              >
              <div class="q-card__section q-card__section--vert">
                <div>{{ product?.name }}</div>
                <div class="text-subtitle2" v-html="product?.price_html"></div>
              </div>
              <div class="q-card__actions justify-start q-card__actions--horiz row">
                <div v-if="!product?.is_in_stock">Out of stock</div>
                <button
                  v-else
                  class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-secondary text-white q-btn--actionable"
                  type="button"
                >
                  <span class="q-btn__content text-center col items-center justify-center row">
                    <span class="block">Add to Cart</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
  </div>

  <div class="q-carousel__control absolute absolute-left flex items-center" style="margin: 18px;">
    <button aria-label="Previous slide" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-primary q-btn--dense" type="button">
      <span class="q-btn__content text-center col items-center justify-center row">
        <i class="q-icon"><svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></i>
      </span>
    </button>
  </div>
  <div class="q-carousel__control absolute absolute-right flex items-center" style="margin: 18px;">
    <button aria-label="Next slide" class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-primary q-btn--dense" type="button">
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
      :infinite="showCarouselControls"
      :navigation="showCarouselControls"
      swipeable
      :arrows="false"
      height="100%"
      control-color="primary"
      class="rounded-borders"
        tabindex="0"
        @keydown="onKeydown_products"
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
            class="col-12 col-sm-6 col-md-4 relative-position"
          >
            <div v-if="fp.__placeholder" class="q-card invisible-card"></div>

            <div v-else>
          <ProductCard :product="fp" />
            </div>
          </div>
        </div>
      </q-carousel-slide>

  <!-- Keep the look: bind btnProps, add aria-label, keep visual style -->
  <template v-if="showCarouselControls" #navigation-icon="{ name, onClick, btnProps }">
    <q-btn
      v-bind="btnProps"
      :flat="false"
      :color="slide === name ? 'secondary' : (btnProps.color || 'grey-5')"
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
        color="secondary"
        @click="slide = (Number(slide) + 1) % slideChunks.length"
      />
    </q-carousel-control>
  </template>

    </q-carousel>

  </div>
</section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-overlay">
          <div class="cta-img">
            <img loading="lazy" alt="Forest view" src="/cta-img.png" width="728" height="500" />
          </div>
          <div class="cta-content">
            <span class="text-white pre-title">The Botanical Ethos</span>
            <h2 class="text-h4 text-white q-mb-md">Grown with Care, Crafted with Soul.</h2>
           <p class="text-white desc">Our journey began in a small glasshouse, driven by the desire to merge
ancient herbal wisdom with modern dermatological science. Every
ingredient is ethically harvested at its peak potency.</p>
            <q-btn
              ref="ctaBtn"
              label="Explore Our Roots"
              color="primary"
              text-color="secondary"
              :rounded="true"
              size="lg"
              to="/products"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
<section class="testimonials-section">
 <div class="container">
  <h2 class="text-h4 text-weight-light text-center q-mb-lg">
    What Our Customers Say
  </h2>

<q-carousel
    tabindex="0"
    v-if="isHydrated"
    :key="testimonialCarouselKey"
  v-model="testimonialsSlide"
  @touchstart.stop
      @mousedown.stop
      animated
      :infinite="showTestimonialCarouselControls"
      :navigation="showTestimonialCarouselControls"
      swipeable
      :arrows="false"
  height="auto"
      @keydown="onKeydown_testimonials"

>
  <q-carousel-slide
    v-for="(group, slideIndex) in testimonialSlideChunks"
    :key="slideIndex"
    :name="slideIndex"
  >
    <div class="row q-col-gutter-md">
      <div
        class="col-12 col-md-4"
        v-for="(testimonial, index) in group"
        :key="index"
      >
        <div class="q-card q-pa-md">
<article
  itemscope
  itemtype="https://schema.org/Review"
>
  <!-- Author -->
  <h3
    class="text-subtitle1 q-mb-sm"
    itemprop="author"
    itemscope
    itemtype="https://schema.org/Person"
  >
    <span itemprop="name">{{ testimonial.name }}</span>
  </h3>

  <!-- Rating -->
  <div
    itemprop="reviewRating"
    itemscope
    itemtype="https://schema.org/Rating"
    class="q-mb-sm"
  >
    <meta itemprop="ratingValue" :content="testimonial.rating" />
    <meta itemprop="bestRating" content="5" />

    <q-rating
      :model-value="testimonial.rating ?? 0"
      size="20px"
      color="amber"
      :icon="matStar"
      readonly
    />
  </div>

  <!-- Review text -->
  <p itemprop="reviewBody" class="text-body2">
    {{ testimonial.feedback }}
  </p>
</article>
        </div>
      </div>
    </div>
  </q-carousel-slide>

    <!-- Keep the look: bind btnProps, add aria-label, keep visual style -->
  <template v-if="showTestimonialCarouselControls" #navigation-icon="{ name, onClick, btnProps }">
    <q-btn
      v-bind="btnProps"
      :flat="false"
      :color="testimonialsSlide === name ? 'secondary' : 'primary'"
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
  <template v-if="showTestimonialCarouselControls" #control>
    <q-carousel-control position="left" class="flex items-center">
      <q-btn
        :icon="matChevronLeft"
        aria-label="Previous slide"
        flat
        round
        dense
        color="secondary"
        @click="testimonialsSlide = (Number(testimonialsSlide) - 1 + testimonialSlideChunks.length) % testimonialSlideChunks.length"
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
        @click="testimonialsSlide = (Number(testimonialsSlide) + 1) % testimonialSlideChunks.length"
      />
    </q-carousel-control>
  </template>

</q-carousel>
  </div>
</section>

    <!-- Instagram Feed Section -->
    <section class="instagram-section" v-once>
      <div class="container">
      <h2 class="text-h4 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <img width="200" height="200" :src="post.image" :alt="post.caption" class="rounded-borders full-width" />
        </div>
      </div>
      </div>
    </section>

    <!-- Newsletter Signup Section -->
    <section class="newsletter-section">
      <div class="container text-center">
      <h2 class="text-h4 text-weight-light q-mb-md">Join the Garden</h2>
      <p class="text-body1 q-mb-lg">Receive our monthly Journal on botanical wellness, plus 15% off your first ritual.</p>
      <label v-if="!isHydrated" class="q-field row no-wrap items-start q-field--filled q-input q-field--labeled subscribe-email-input q-mb-md" style=""><!----><div class="q-field__inner relative-position col self-stretch"><div class="q-field__control relative-position row no-wrap" tabindex="-1"><div class="q-field__control-container col relative-position row no-wrap q-anchor--skip"><input class="q-field__native q-placeholder" style="" tabindex="0" aria-label="Your Email" type="text" value=""><div class="q-field__label no-pointer-events absolute ellipsis">Your Email</div><!----></div></div><!----></div><!----></label>
      <q-input v-else filled v-model="email" label="Your email address" class="subscribe-email-input q-mb-md" />
      <button v-if="!isHydrated" class="rounded q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-secondary text-white q-btn--actionable q-focusable q-hoverable" style="" tabindex="0" type="button"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block">Subscribe</span></span></button>
      <q-btn v-else :rounded="true" label="Subscribe" color="secondary" text-color="primary" @click="subscribeNewsletter" />
   </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, useSSRContext } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { useRoute } from 'vue-router' // Standard import is tiny
import productsStore from 'src/stores/products'
import { matChevronLeft, matChevronRight, matStar } from '@quasar/extras/material-icons'
import { defineAsyncComponent } from 'vue'
import { loadPageConfig } from 'src/utils/config-loader'
import { useCarouselKeyboard } from 'src/composables/useCarouselKeyboard'
import ProductCard from 'src/components/ProductCard.vue'

// Add this here

// Instead of standard imports, do this:
const QCarousel = defineAsyncComponent(() => import('quasar').then(m => m.QCarousel))
const QCarouselSlide = defineAsyncComponent(() => import('quasar').then(m => m.QCarouselSlide))
const QCarouselControl = defineAsyncComponent(() => import('quasar').then(m => m.QCarouselControl))
const QInput = defineAsyncComponent(() => import('quasar').then(m => m.QInput))

const isHydrated = ref(false)
const $q = useQuasar()

// Sync data immediately so the static HTML is correct
if (process.env.CLIENT && window.__HOME_PRODUCTS_DATA__ && Array.isArray(window.__HOME_PRODUCTS_DATA__)) {
  productsStore.products.value = window.__HOME_PRODUCTS_DATA__
}

const route = useRoute();
// ----------------- Scroll -----------------
const scrollToProducts = () => {}
defineExpose({ scrollToProducts })

// ----------------- SEO -----------------

// Inside your Page or Layout
defineOptions({
  async preFetch ({ ssrContext, currentRoute }) {
    console.log('--- PreFetch Running for:', currentRoute.path)
    const {fetchSeoForPath} = await import('src/composables/useSeo')
    /*const seo = await fetchSeoForPath('homepage')
    //const seo = null;
    // 2. FETCH PRODUCTS (This was missing!)
    await productsStore.preFetchProducts()*/
    // Fire both requests at the same time
    const isPreview = currentRoute.query.preview === 'true'

    const [seo, configData] = await Promise.all([
      fetchSeoForPath('homepage'),
      loadPageConfig('home', isPreview), // The helper we'll create
    ])

    //console.log(configData);
    // 2. Prepare the "Lean" data
    // We only need the first 6 for the homepage carousel
    //const leanProducts = productsStore.products.value.slice(0, 6)
    const featuredIds = configData?.featured_products || []
    const leanProducts = featuredIds.length
  ? await productsStore.getByIds(featuredIds)
  : productsStore.products.value.slice(0, 6)

    if (ssrContext) {
      // Initialize the state object if it doesn't exist
      ssrContext.seoData = seo
      // INJECT PRODUCTS HERE:
      ssrContext.homeProductsData = leanProducts
      ssrContext.pageConfig = configData
      // 2. Attach it to the rendered state (for the component)
      ssrContext.heroData = {
        src: 'https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png',
        srcset: 'https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-300x300.png 300w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover-768x512.png 768w,https://nuxt.meidanm.com/wp-content/uploads/2025/10/naturabloom-hero-cover.png 1024w',
        sizes: '(min-width: 768px) 50vw, calc(100vw - 40px)'
      }
    }
  }
})

const homeSettings = ref(null)
const seoData = ref(null)

// 3. APPLY META
useMeta(() => {
  const seo = seoData.value;

  // If data isn't ready yet, return an empty object or just the default title.
  // This prevents the "Flicker" and avoids the Vue warning.
  if (!seo) {
    return {};
  }

  // Once seoData.value is populated, Quasar will automatically
  // detect the change and update the DOM.
  return {
    title: seo.title,
    meta: {
      robots: { name: 'robots', content: seo.robots, key: 'robots' },
      description: { name: 'description', content: seo.description, key: 'description' },
      'og:title': { property: 'og:title', content: seo.title },
      'og:image': { property: 'og:image', content: seo.og_image },
    }
  };
});
/*(() => {
  const seo = seoData.value;
  return {
    title: seo?.title || 'NaturaBloom',
    meta: {
      robots: {name: 'robots', content: seo?.robots || 'index, follow'},
      description: {name: 'description', content: seo?.description},
      'og:title': {property: 'og:title', content: seo?.title},
      'og:description': {property: 'og:description', content: seo?.description},
      'og:image': {property: 'og:image', content: seo?.og_image},
      'og:type': {property: 'og:type', content: 'website'},
    }
  };
});*/
// 1. THE SERVER FIX (Force the HTML to populate)
if (process.env.SERVER) {
  const ssr = useSSRContext()
  homeSettings.value = ssr?.pageConfig || null
  seoData.value = ssr?.seoData || null
}


// --- fill SSR payload first (if exists) ---

const visibleStaticItems = computed(() => {
  const ids = homeSettings.value?.featured_products || []
  let items = []

  if (ids && ids.length) {
    // ✅ SYNC FIND: This avoids the Promise issue and forces the order of the 'ids' array
    items = ids.map(id => {
      return productsStore.products.value.find(p => Number(p.id) === Number(id))
    }).filter(Boolean)
  }

  // Fallback to first 6 if no IDs are found (to match recomputeSlides logic)
  if (!items.length) {
    items = (productsStore.products.value || []).slice(0, 6)
  }

  // We only show 3 in the static view
  const result = items.slice(0, 3)

  // Pad placeholders
  while (result.length < 3) {
    result.push({ __placeholder: true, id: `placeholder-${result.length}` })
  }

  return result
})
// ----------------- Setup -----------------
const API_BASE = import.meta.env.VITE_API_BASE

const slideChunks = ref([])
const testimonialSlideChunks = ref([])
const slide = ref(0)
const carouselKey = ref(0)
const testimonialCarouselKey = ref(0)
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
  if (!isHydrated.value) return

  if (!productsStore.products.value.length) {
    await productsStore.preFetchProducts('', true)
  }

  const ids = homeSettings.value?.featured_products || []
  const allProducts = await productsStore.getByIds(ids) || []

  let items = ids.length
  ? ids.map(id => allProducts.find(p => p.id == id)).filter(Boolean)
  : allProducts.slice(0, 6)

  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  if(chunkSize === 3) {
    // pad to always 3
    while (items.length < 3) {
      items.push({__placeholder: true, id: `placeholder-${items.length}`})
    }
  }
  if (forceRemount) carouselKey.value++

  slideChunks.value = getChunks(items, chunkSize)
}
const showCarouselControls = computed(() => {
  return slideChunks.value.length > 1
})

const totalProductSlides = computed(() => slideChunks.value.length)

const { onKeydown: onKeydown_products } = useCarouselKeyboard(
  slide,
  totalProductSlides
)
// ----------------- Testimonials & Instagram -----------------
//const avatarSVG =
  '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="40" r="40" fill="#E8F5E9"/> <circle cx="40" cy="30" r="12" fill="#81C784"/> <path d="M20 60c0-10 9-18 20-18s20 8 20 18H20z" fill="#81C784"/> </svg>'

const testimonials = ref([
  { name: 'Alice Johnson', feedback: 'NaturaBloom products have transformed my skincare routine!' },
  { name: 'Mark Thompson', feedback: 'I love the organic ingredients and sustainable packaging.' },
  { name: 'Sophie Lee', feedback: 'Fast shipping and excellent customer service.' },
  { name: 'John Doe', feedback: 'Amazing quality!' },
  { name: 'Jane Smith', feedback: 'Will buy again.' }
])

const testimonialsSlide = ref(0)

const recomputeTestimonialSlides = async (forceRemount = false) => {
  if (!isHydrated.value) return

  if (!testimonials.value.length) {
    return;
  }

  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3

  if (forceRemount) testimonialCarouselKey.value++

  testimonialSlideChunks.value = getChunks(testimonials.value, chunkSize)
}

const showTestimonialCarouselControls = computed(() => {
  return testimonialSlideChunks.value.length > 1
})
// assuming you already have testimonialSlideChunks
const totalTestimonialSlides = computed(() => testimonialSlideChunks.value.length)

const { onKeydown: onKeydown_testimonials } = useCarouselKeyboard(
  testimonialsSlide,
  totalTestimonialSlides
)

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

// ----------------- Mounted -----------------
onMounted(async() => {
    if (window.__PAGE_CONFIG__ && Object.keys(window.__PAGE_CONFIG__).length) {
      homeSettings.value = window.__PAGE_CONFIG__
    } else {
      const isPreview = route.query.preview === 'true'
      // Use it directly
      const freshConfig = await loadPageConfig('home', isPreview)
      if (freshConfig) homeSettings.value = freshConfig
    }

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

      requestIdleCallback(() => {

        // Cleanup listeners
        window.removeEventListener('scroll', hydrateOnInteraction)
        window.removeEventListener('mousemove', hydrateOnInteraction)
        window.removeEventListener('touchstart', hydrateOnInteraction)

        isHydrated.value = true
        recomputeSlides()
        recomputeTestimonialSlides();

      })
    }

    window.addEventListener('scroll', hydrateOnInteraction, {passive: true})
    window.addEventListener('mousemove', hydrateOnInteraction, {passive: true})
    window.addEventListener('touchstart', hydrateOnInteraction, {passive: true})

    // Safety fallback: Hydrate after 5 seconds if no interaction
    setTimeout(hydrateOnInteraction, 3000)

  }
})

watch(isHydrated, async (val) => {
  if (!val) return;

  try {

    // 4. UI INITIALIZATION
    // Now that data is guaranteed to be in the store, we setup the carousel
    await recomputeSlides(true);

    await recomputeTestimonialSlides(true);
    // 1. DATA FETCHING (Parallel)
    const {fetchSeoForPath} = await import('src/composables/useSeo');
    // 2. SEO UPDATE
    seoData.value = await fetchSeoForPath('homepage');

    // 5. RESPONSIVE LISTENER
    // We only start listening to screen/store changes AFTER initial hydration is done

  } catch (err) {
    console.error('Hydration error:', err);
  }
}, { immediate: true });

watch(
  [() => productsStore.products.value, () => $q.screen.name, () => homeSettings.value],
  () => {
    if (!isHydrated.value) return
    recomputeSlides(true)
    recomputeTestimonialSlides(true);

  }
)
</script>

<style scoped>
.hero-section-sec{--text:#1e1e1e;--muted:#6f6f6f;/*--primary1:#f6f2e7;--primary2:#e9ddc4;--primary3:#d0c1a3;--primary4:#bfa07c;--primary5:#a88360;*/--card-shadow:0 12px 40px rgba(16,16,16,0.08);position:relative;inset:0;/*display:flex;align-items:center}.hero-section-sec:before{content:"";position:absolute;width:100%;height:100%;z-index:0;top:0;left:0;background:radial-gradient(circle at 20% 30%,#fff 0,transparent 60%),radial-gradient(circle at 80% 70%,rgba(255,255,255,.7) 0,transparent 60%),radial-gradient(circle at 50% 50%,rgba(255,255,255,.38) 0,#00000000 60%);background-size:200% 200%*/ background: var(--q-primary);}.hero-section{padding:0 20px;position:relative;overflow:hidden;z-index:1;width:100%}.hero-content h1{overflow-wrap:anywhere;text-indent:-4px;font-weight:400;font-size:14vw;line-height:1.1;margin-top:0;margin-bottom:12px;display:block}.hero-content .text-h6{max-width:450px;margin-bottom:24px!important}.lcp-wrapper{display:block;width:100%;aspect-ratio:3/2;position:relative;overflow:hidden;border-radius:50px;/*background:rgba(0,0,0,.03);contain:paint;transform:translateZ(0)*/}.hero-img{width:100%;height:100%;display:block;object-fit:cover}.hero-content button.hero-btn{border-radius:50px;padding:10px 24px;color:#fff;background:var(--primary-gradient);border:none;cursor:pointer;position:relative;font-weight:400;height:44px;display:inline-flex;align-items:center;justify-content:center}.hero-content button:before{content:"";display:block;position:absolute;inset:0;border-radius:inherit;box-shadow:0 1px 5px rgba(0,0,0,.2),0 2px 2px rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12);transition:box-shadow .3s cubic-bezier(.25,.8,.5,1)}.hero-content button:hover .q-focus-helper{opacity:1}@media (min-width:768px){.lcp-wrapper{width:50%}.hero-content h1{font-size:4rem}}

@keyframes gradientAnimation {
  0% {background-position: 0% 50%;}
  50% {background-position: 100% 50%;}
  100% {background-position: 0% 50%;}
}

section.featured-products {
    min-height: 664px;
  background: #F8F3E4;
}

div.q-img__loading > svg{
  display: none;
}

.my-card img {
  object-fit: cover;
  pointer-events: none;
  border-radius: 20px;
}

.hero-content button:hover .q-focus-helper:after {
  opacity: 0.15;
}

.pre-animate {
  opacity: 0;
  visibility: hidden;
}

.newsletter-section, .instagram-section {
  content-visibility: auto;
}

/* HOMEPAGE DEFFERED CSS */
.cta-section {
  position: relative;
  overflow: hidden;
  min-height: 400px;
  /*padding: 0;*/
  background: #345646;
}
.cta-section .container {
  height: 100%;
  max-width: 1500px;
}

.cta-section .cta-img img {
  max-width: 100%;
  object-fit: cover;
  border-radius: 25px;
}
.cta-overlay {
  position: relative;
  /*z-index: 1;
  height: 100%;
  background: linear-gradient(-45deg, #4c6e5d96, var(--q-primary), #4c6e5d96);
  background-size: 600% 600%;
  animation: none;*/
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
  padding-top: 40px;
}
.cta-content .pre-title {
 text-transform: uppercase;
}
.cta-content .desc {
  font-size: 20px;
  margin-bottom: 30px;
}
@media(max-width: 767px) {
  .hero-content h1.text-h1 {
    font-size: 14vw;
  }

  .hero-section {
    padding: 0px;
  }

}
@media(max-width: 1023px){
  .cta-overlay {
    flex-direction: column;
  }
  .cta-section .cta-img img {
    max-height: 200px;
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
  .hero-content.col-12.col-md-6.q-mb-lg {
    padding-right: 35px;
  }

  .cta-section .cta-img {
    width: 50%;
  }
  .cta-content {
    padding: 40px 20px;
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

.testimonials-section {
  background: var(--q-primary);
}
.testimonials-section .q-card {
  transition: transform 0.3s;
  background: #F8F3E4;
}
.testimonials-section q-card:hover {
  transform: translateY(-5px);
}

.newsletter-section {
  background-color: #FEF9EA;
}
.newsletter-section .container {
  max-width: 896px;
  background: #e7e2d4;
  border-radius: 28px;
  padding: 70px 16px;
}
.newsletter-section :deep(.q-field__control) {
  border-radius: 28px;
}

.instagram-section {
  background: #F8F3E4;
}
.instagram-section img {
  cursor: pointer;
  transition: transform 0.3s;
  object-fit: cover;
}
.instagram-section img:hover {
  transform: scale(1.05);
}

.subscribe-email-input {
  max-width: 500px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

</style>
