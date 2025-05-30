<template>
  <q-page class="q-pa-md">

    <!-- Hero Section -->
    <div class="hero-section q-mb-xl">
      <div class="hero-content container">
        <h1 class="text-h2 text-white">NaturaBloom</h1>
        <p class="text-white">We encompasses products that are organic, cruelty-free, and environmentally friendly</p>
        <q-btn label="Browse Products" color="primary" class="q-mt-md" @click="scrollToProducts" />
      </div>
    </div>

    <!-- Featured Products Slider -->
    <section ref="productSection" class="featured-products q-my-xl">
      <div class="container">
        <h2 class="text-h3 text-center q-mb-md">Featured Products</h2>
        <q-carousel
          v-if="slideChunks && slideChunks.length > 0"
          v-model="slide"
          animated
          infinite
          autoplay
          navigation
          height="550px"
          class="bg-grey-2 rounded-borders shadow-2"
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
          :src="fp.images[0]?.src || 'https://via.placeholder.com/400x300?text=No+Image'"
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

    <!-- About Section -->
    <section class="about-section container q-mt-xl q-mb-xl">
      <h2 class="text-h5 q-mb-md">Why Shop With Us?</h2>
      <p class="text-body1 q-mb-sm">We blend modern frontend technology with the flexibility of WordPress to give you the best shopping experience.</p>
      <p class="text-body1">Enjoy a smooth, secure and responsive shop built with Vue and Quasar — fast, clean and customizable.</p>
    </section>




  </q-page>
</template>

<script>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useQuasar } from 'quasar';
import api from 'src/boot/woocommerce';
import cart from 'src/stores/cart';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);

export default {
  name: 'IndexPage',
  setup() {
    const $q = useQuasar();
    const products = ref([]);
    const featuredProducts = ref([]);
    const productSection = ref(null);
    const carousel = ref(null);
    const ctaBtn = ref(null);
    const slideChunks = ref(false);
    const slide = ref(0);

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
      console.log(slideChunks.value);
    };

    const fetchProducts = async () => {
      const allProducts = await api.getProducts();
      products.value = allProducts;
      featuredProducts.value = allProducts.filter(p => p.featured).slice(0, 6);
      featuredProducts.value = allProducts.filter(p => p.id).slice(0, 6);
      console.log(featuredProducts.value);
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
          offsetY: 80,
        },
        ease: 'power2.out',
      });
    };

    const nextSlide = () => {
      carousel.value.next();
    };

    const prevSlide = () => {
      carousel.value.prev();
    };

    onMounted(() => {
      fetchProducts();
//computeSlideChunks();
      gsap.from('.hero-content', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      nextTick(() => {
        gsap.from(ctaBtn.value.$el, {
          opacity: 0,
          y: 20,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
          },
        });
      });
    });

    watch(() => $q.screen.name, () => {
      computeSlideChunks();
    });

    return {
      slideChunks,
      addToCart,
      getSlugFromPermalink,
      scrollToProducts,
      nextSlide,
      prevSlide,
      productSection,
      carousel,
      ctaBtn,
      slide
    };
  },
};
</script>

<style scoped>
.hero-section {
  background: linear-gradient(to bottom right, #2c3e50, #34495e);
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

.featured-products-section {
  margin-top: 40px;
}

.cta-section {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  height: 400px;
  margin-bottom: 40px;
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
  background: linear-gradient(-45deg, rgba(255, 182, 193, 0.6), rgba(255, 105, 180, 0.5), rgba(255, 192, 203, 0.6));
  background-size: 600% 600%;
  animation: gradientShift 5s ease infinite;
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
</style>
