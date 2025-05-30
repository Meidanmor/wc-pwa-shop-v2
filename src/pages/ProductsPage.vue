<template>
  <q-page class="q-pa-md">
    <div class="container">
  <h2>Products</h2>

      <!-- Search and Filter -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-md-6">
          <q-input filled v-model="search" label="Search products..." debounce="300" />
        </div>
        <div class="col-xs-12 col-md-6">
          <q-select
            filled
            v-model="selectedCategory"
            :options="categoryOptions"
            label="Filter by category"
            emit-value
            map-options
            clearable
          />
        </div>
      </div>

<q-card
  class="q-pa-md q-mb-md"
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
    @change="paginatedProducts"
  />
</q-card>


      <!-- Total Products -->
      <div class="text-subtitle1 q-mb-sm">
        Found {{ filteredProducts.length }} product{{ filteredProducts.length === 1 ? '' : 's' }}
      </div>

      <!-- Product Grid -->
      <div class="row q-col-gutter-md">
        <div
          v-for="product in paginatedProducts"
          :key="product.id"
          class="col-xs-12 col-sm-6 col-md-4"
        >
          <q-card class="my-card full-height">
            <q-img
              v-if="product.images.length"
              :src="product.images[0].src"
              :alt="product.name"
              height="300px"
              width="auto"
              class="rounded-borders"
            />
            <q-img
              v-else
              src="https://via.placeholder.com/400x300?text=No+Image"
              alt="No image available"
              ratio="4/3"
              class="rounded-borders"
            />
            <q-card-section>
              <div class="text-h6">{{ product.name }}</div>
              <div class="text-subtitle2" v-html="product.price_html" />
            </q-card-section>
            <q-card-actions>
              <q-btn label="Add to Cart" color="primary" @click="addToCart(product)" />
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

      <!-- Pagination -->
      <div class="q-mt-lg flex flex-center">
        <q-pagination
          v-model="currentPage"
          :max="totalPages"
          max-pages="6"
          boundary-numbers
          direction-links
          color="primary"
        />
      </div>

    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import api from 'src/boot/woocommerce';
import cart from 'src/stores/cart';

export default {
  name: 'ProductsPage',
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const selectedCategory = ref(null);
    const search = ref('');
    const currentPage = ref(1);
    const perPage = 6;

    // Price filter refs
    const priceMin = ref(0);
    const priceMax = ref(1000);
    const priceRange = ref({min: 0,max: 1000});

    const categoryOptions = computed(() =>
      categories.value.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }))
    );

    const filteredProducts = computed(() => {
    console.log(products);
      return products.value.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
        const matchCategory =
          !selectedCategory.value ||
          p.categories.some((c) => c.id === selectedCategory.value);
        const productPrice = parseFloat( (p.prices.price) ) / 100;
        const matchPrice =
          productPrice >= priceRange.value.min && productPrice <= priceRange.value.max;

        return matchSearch && matchCategory && matchPrice;
      });
    });

    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage));

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredProducts.value.slice(start, start + perPage);
    });

    const fetchProducts = async () => {
      products.value = await api.getProducts();

      // Auto-calculate price range
      const prices = products.value.map((p) => parseFloat( (p.prices.price_range != null ? p.prices.price_range.max_amount : p.prices.price) ) / 100);
      console.log(prices);
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      priceMin.value = min;
      priceMax.value = max;
      priceRange.value = {min: min,max: max};
      console.log(priceRange.value);

    };

    const fetchCategories = async () => {
      categories.value = await api.getCategories();
    };

    const addToCart = (product) => {
      cart.add(product.id, 1);
      console.log('Added to cart:', product.id);
    };

    const getSlugFromPermalink = (permalink) => {
      return permalink.split('/').filter(Boolean).pop();
    };

  // ✅ Add the watch here
  watch(priceRange, (val) => {
    console.log('🧪 priceRange changed:', val, 'min:', priceMin.value, 'max:', priceMax.value);
  });

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      products,
      filteredProducts,
      paginatedProducts,
      search,
      selectedCategory,
      categoryOptions,
      currentPage,
      totalPages,
      addToCart,
      getSlugFromPermalink,

      // expose price filter
      priceMin,
      priceMax,
      priceRange
    };
  },
};
</script>

<style scoped>
.my-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
