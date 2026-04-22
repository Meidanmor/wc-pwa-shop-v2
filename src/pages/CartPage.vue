<template>
  <div class="container q-pa-md">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0" class="empty-cart-msg">
      Your cart is empty. <router-link to="/products/">Go to shop</router-link>
    </div>
    <div v-else>
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="q-mb-md row items-center"
      >
        <img :src="item.images[0]?.src" width="80" height="80" class="q-mr-md" />
        <div class="column">
          <div>{{ item.name }}</div>
          <div v-if="item.variation && item.variation.length > 0">
             <div
             v-for="(variation, index) in item.variation"
             :key="index"
             >
             {{variation.attribute}}: {{variation.value}}
             </div>
          </div>
          <div>{{ item.price }} × {{ item.qty }}</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
import cart from 'src/stores/cart';
import { computed } from 'vue';

const cartItems = computed(() => cart.state.items);
</script>

<style scoped>
.empty-cart-msg {
  padding: 20px 0;
  font-size: 20px;
}
.empty-cart-msg a {
  text-decoration: underline;
  font-weight: 600;
}
</style>
