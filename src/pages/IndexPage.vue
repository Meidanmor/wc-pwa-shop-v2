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
        <q-carousel
          v-if="slideChunks && slideChunks.length > 0"
          v-model="slide"
          animated
          infinite
          autoplay
          navigation
          swipeable
          arrows
          height="550px"
          control-color="primary"
          class="rounded-borders"
        >
          <q-carousel-slide
            v-for="(slideGroup, index) in slideChunks"
            :key="index"
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
                    width="100%"
                    height="300px"
                    :src="fp.images[0]?.src || 'https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png'"
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
        <q-banner v-else-if="slideChunks && slideChunks.length === 0" class="bg-grey-2 text-center q-pa-md">No featured products found.</q-banner>
        <div v-else class="q-pa-md flex items-center justify-center">
          <q-spinner color="primary" size="6em" />
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
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
    <section class="testimonials-section container q-my-xl">
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
    <section class="sustainability-section container q-my-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <img src="https://example.com/sustainability.jpg" alt="Sustainability" class="full-width" />
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
    <section class="newsletter-section container q-my-xl text-center">
      <h2 class="text-h3 text-weight-light q-mb-md">Stay Updated</h2>
      <p class="text-body1 q-mb-lg">Subscribe to our newsletter for the latest products and offers.</p>
      <q-input filled v-model="email" label="Your Email" class="subscribe-email-input q-mb-md" />
      <q-btn label="Subscribe" color="primary" @click="subscribeNewsletter" />
    </section>

    <!-- Instagram Feed Section -->
    <section class="instagram-section container q-my-xl">
      <h2 class="text-h3 text-weight-light text-center q-mb-lg">Follow Us on Instagram</h2>
      <div class="row q-col-gutter-md">
        <div class="col-6 col-md-3" v-for="(post, index) in instagramPosts" :key="index">
          <q-img :src="post.image" :alt="post.caption" class="rounded-borders" />
        </div>
      </div>
    </section>

    <!-- Enhanced About Section -->
    <section class="about-section container q-my-xl">
      <h2 class="text-h3 text-weight-light text-center q-mb-md">About NaturaBloom</h2>
      <p class="text-body1 text-center">
        NaturaBloom blends modern technology with nature's purity, offering organic, cruelty-free, and environmentally friendly products.
      </p>
    </section>


  </q-page>
</template>

<script setup async>
import { ref, onMounted, nextTick, watch } from 'vue';
//import { useRoute } from 'vue-router';
import { useQuasar, useMeta } from 'quasar';
import api from 'src/boot/woocommerce';
import cart from 'src/stores/cart';
import gsap from 'gsap';
//import { useSeo } from 'src/composables/useSeo';

const $q = useQuasar();
//const route = useRoute();

const products = ref([]);
const featuredProducts = ref([]);
const productSection = ref(null);
//const carousel = ref(null);
const ctaBtn = ref(null);
const slideChunks = ref(false);
const slide = ref(0);
const email = ref('');
const seoData = ref({
  title: 'Home page',
  description: 'Home page description'
});

// Fetch SEO data during SSR
async function fetchSeoData() {
  try {
    const res = await fetch(`https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${encodeURIComponent('homepage')}`)
    const json = await res.json()
    console.log(json);
    seoData.value = {
      title: json.title,
      description: json.description
    }
    console.log('[SSR] Fetched SEO:', json.title)
  } catch (err) {
    console.error('[SSR] SEO Fetch Error:', err)
  }
}

if (process.env.SERVER) {
  await fetchSeoData()
}
useMeta(() => ({
  title: seoData.value.title,
  meta: {
    description: {
      name: 'description',
      content: seoData.value.description
    },
    'og:title': {
      property: 'og:title',
      content: seoData.value.title
    },
    'og:description': {
      property: 'og:description',
      content: seoData.value.description
    }
  }
}))
const testimonials = ref([
  {
    name: 'Alice Johnson',
    feedback: 'NaturaBloom products have transformed my skincare routine!',
    avatar: 'https://example.com/avatar1.jpg'
  },
  {
    name: 'Mark Thompson',
    feedback: 'I love the organic ingredients and sustainable packaging.',
    avatar:
      '<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="40" cy="40" r="40" fill="#E8F5E9"/> <circle cx="40" cy="30" r="12" fill="#81C784"/> <path d="M20 60c0-10 9-18 20-18s20 8 20 18H20z" fill="#81C784"/> </svg>'
  },
  {
    name: 'Sophie Lee',
    feedback: 'Fast shipping and excellent customer service.',
    avatar: 'https://example.com/avatar3.jpg'
  }
]);

const instagramPosts = ref([
  { image: 'https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png', caption: 'Our latest product launch!' },
  { image: 'https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png', caption: 'Behind the scenes at NaturaBloom.' },
  { image: 'https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png', caption: 'Customer favorites this month.' },
  { image: 'https://nuxt.meidanm.com/wp-content/uploads/2025/05/procudts-catalog-img.png', caption: 'Sustainable packaging in action.' }
]);

const subscribeNewsletter = () => {
  if (email.value) {
    $q.notify({ type: 'positive', message: 'Subscribed successfully!' });
    email.value = '';
  } else {
    $q.notify({ type: 'negative', message: 'Please enter a valid email.' });
  }
};

const getChunks = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const computeSlideChunks = () => {
  const chunkSize = $q.screen.lt.sm ? 1 : $q.screen.lt.md ? 2 : 3;
  slideChunks.value = getChunks(featuredProducts.value, chunkSize);
};

const fetchProducts = async () => {
  const allProducts = await api.getProducts();
  products.value = allProducts;
  featuredProducts.value = allProducts.filter(p => p.id).slice(0, 6);
  computeSlideChunks();
};

const addToCart = (product) => {
  cart.add(product.id, 1);
};

const getSlugFromPermalink = (permalink) =>
  permalink.split('/').filter(Boolean).pop();

const scrollToProducts = () => {
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: productSection.value,
      offsetY: 80
    },
    ease: 'power2.out'
  });
};

/*const subscribe = () => {
  if (email.value) {
    $q.notify({ type: 'positive', message: 'Thanks for subscribing!' });
    email.value = '';
  } else {
    $q.notify({ type: 'warning', message: 'Please enter a valid email.' });
  }
};*/

onMounted(async () => {
  if (process.env.CLIENT) {
    await fetchSeoData();
    const gsap = (await import('gsap')).default;
    const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
    gsap.registerPlugin(ScrollToPlugin);
    window.gsap = gsap;
    fetchProducts();
  }

  gsap.from('.hero-content', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });
  gsap.from('.testimonials-section', { opacity: 0, y: 50, duration: 1 });
  gsap.from('.sustainability-section', { opacity: 0, x: -50, duration: 1, delay: 0.5 });
  gsap.from('.newsletter-section', { opacity: 0, y: 50, duration: 1, delay: 1 });
  gsap.from('.instagram-section', { opacity: 0, y: 50, duration: 1, delay: 1.5 });
  gsap.from('.about-section', { opacity: 0, y: 50, duration: 1, delay: 2 });

  nextTick(() => {
    gsap.from(ctaBtn.value.$el, {
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%'
      }
    });
  });
});

watch(() => $q.screen.name, () => {
  computeSlideChunks();
});
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
@media(max-width: 767px){
  h1 {
    font-size: 40px;
  }
}
</style>
