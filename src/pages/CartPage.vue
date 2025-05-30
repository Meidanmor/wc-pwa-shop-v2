<template>
  <q-page class="q-pa-md">
  <div class="container">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0">
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
  </q-page>
</template>

<script setup>
import cart from 'src/stores/cart';
import { computed } from 'vue';

const cartItems = computed(() => cart.state.items);
</script>
