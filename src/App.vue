<template>
  <div>
    <q-banner v-if="isOnline === false" class="bg-orange text-white q-pa-sm" dense>
      <template #avatar>
        <q-icon name="wifi_off" />
      </template>
      You are currently offline. Some features may be limited.
    </q-banner>

    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useQuasar } from 'quasar';
import cart from "src/stores/cart.js";
const $q = useQuasar();
const isOnline = ref(true); // Assume online by default
watch(() => cart.state.offline, (off) => {
  isOnline.value = !off; // update banner
});


onMounted(() => {
  if (typeof navigator !== 'undefined') {
    isOnline.value = navigator.onLine;

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  cart.state.offline = !navigator.onLine;
  console.log('[cart.js] Went '+isOnline.value);

  $q.notify({
    type: navigator.onLine ? 'positive' : 'warning',
    message: navigator.onLine ? 'You are back online!' : 'You are offline. Some features may be limited.',
    icon: navigator.onLine ? 'wifi' : 'signal_wifi_off',
    timeout: 3000
  });

  cart.fetchCart();
  //cart.fetchWishlistItems();

};


    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
console.log('[cart.js] online/offline status listener attached');

    // Cleanup
    onBeforeUnmount(() => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    });
  }
});
</script>

<style scoped>
.q-banner {
  position: sticky;
  top: 0;
  z-index: 999;
}
</style>
