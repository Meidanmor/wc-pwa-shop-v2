<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
    <div class="container">
      <q-toolbar class="flex justify-between q-pa-sm">
       <div class="flex">
     <!-- Desktop Navigation -->
          <q-toolbar-title class="nav-bar" v-if="$q.screen.gt.sm">
            <router-link v-if="isSuperAdmin" to="/admin" class="text-h6 no-decoration"><q-icon name="admin_panel_settings" /> Go to Admin Panel</router-link>
            <router-link to="/" class="text-h6 no-decoration">My Shop</router-link>
            <router-link to="/products/" class="text-h6 no-decoration">Products</router-link>
            <router-link to="/cart/" class="text-h6 no-decoration">Cart</router-link>
            <router-link to="/checkout/" class="text-h6 no-decoration">Checkout</router-link>
            <router-link to="/my-account/" class="text-h6 no-decoration">My account</router-link>
          </q-toolbar-title>

          <!-- Mobile Menu Toggle -->
          <q-btn flat dense icon="menu" v-if="$q.screen.lt.md" @click="mobileMenuDrawer = true" />

       </div>
        <router-link to="/" class="flex items-center q-mr-auto order-first">
          <svg width="180px" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.73 48"><text transform="translate(55 23.71)" style="fill:var(--q-secondary);font-family:ArialMT, Arial; font-size:26px; isolation:isolate;"><tspan x="0" y="0">NaturaBloom</tspan></text><text transform="translate(56 41.71)" style="fill:var(--q-secondary);font-family:ArialMT, Arial; font-size:12px; isolation:isolate;"><tspan x="0" y="0">Let</tspan><tspan x="16.68" y="0" style="letter-spacing:-.02em;">’</tspan><tspan x="19.13" y="0">s Bloom</tspan><tspan x="62.48" y="0" style="letter-spacing:-.02em;"> </tspan><tspan x="65.6" y="0" style="letter-spacing:-.11em;">T</tspan><tspan x="71.6" y="0">ogether</tspan></text><circle cx="24" cy="24" r="24" style="fill:#f3ece2;"/><path d="M24,10c6,10,6,18,0,28-6-10-6-18,0-28Z" style="fill:#a3c9a8;"/></svg>
        </router-link>
          <div>
          <q-btn flat icon="favorite_border" @click="toggleWishlistDrawer">
          <q-badge v-if="cart.state.wishlist_items && Object.keys(cart.state.wishlist_items).length > 0" floating color="red">{{ Object.keys(cart.state.wishlist_items).length }}</q-badge>
        </q-btn>

        <q-btn flat icon="shopping_cart" @click="toggleCart">
          <q-badge v-if="cartCount > 0" floating color="red">{{ cartCount }}</q-badge>
        </q-btn>
        </div>
      </q-toolbar>
     </div>
    </q-header>

    <!-- Mobile Navigation Drawer -->
    <q-drawer
      v-model="mobileMenuDrawer"
      side="left"
      overlay
      behavior="mobile"
      :width="260"
      transition-show="slide-right"
      transition-hide="slide-left"
      :touch-area-width="80"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Menu</div>
          <q-list bordered padding>
            <q-item
      v-if="isSuperAdmin"
      clickable
      v-ripple
      to="/admin"
      active-class="text-primary"
    >
      <q-item-section avatar>
        <q-icon name="admin_panel_settings" />
      </q-item-section>
      <q-item-section>Go to Admin Panel</q-item-section>
    </q-item>

            <q-item clickable v-ripple to="/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon name="home" /></q-item-section>
              <q-item-section>Home</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/products/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon name="storefront" /></q-item-section>
              <q-item-section>Products</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/cart/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
              <q-item-section>Cart</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/checkout/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon name="receipt" /></q-item-section>
              <q-item-section>Checkout</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/my-account/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>My Account</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

  <!-- Wishlist Drawer -->
  <q-drawer
    v-model="wishlistDrawerOpen"
    side="right"
    overlay
    behavior="mobile"
  >
    <WishlistDrawer />
  </q-drawer>
<!-------------- ------->
    <q-drawer
      v-model="cartDrawer"
      side="right"
      overlay
      behavior="mobile"
      :width="300"
      :touch-area-width="80"
    >
      <q-scroll-area class="fit q-pa-sm" v-if="cartCount > 0">
        <h4> Cart </h4>
        <div v-for="item in cartItems" :key="item.id" class="q-pa-sm row items-center" :class="[item.key.includes('offline') ? 'offline-item' : '']">
          <img v-if="item.images" :src="item.images[0]?.thumbnail" style="width: 100px; height: 100px; object-fit: cover" />
          <div class="q-ml-sm column">
            <div>{{ item.name }}</div>
           <div v-if="item.variation && item.variation.length > 0">
             <div
             v-for="(variation, index) in item.variation"
             :key="index"
             >
             {{variation.attribute}}: {{variation.value}}
             </div>
          </div>
            <div v-if="item.prices">{{ item.prices.price }} {{ item.prices.currency_code }}</div>
            <div class="row items-center q-mt-xs">
              <q-btn dense round icon="remove" @click="decrease(item.key)" :disable="item.quantity === 1" />
              <span class="q-mx-sm">{{ item.quantity }}</span>
              <q-btn dense round icon="add" @click="increase(item.id)" />
              <q-btn dense flat icon="close" @click="remove(item.key)" class="q-ml-sm" />
            </div>
          </div>
        </div>

        <router-link to="/checkout/">
         <q-btn
          color="primary"
          label="Checkout"
        />
        </router-link>

      </q-scroll-area>

      <div v-else class="q-pa-sm row items-center">
      <h5>seems like your cart is empty</h5>
       <router-link to="/products/">
         <q-btn
          color="primary"
          label="Shop now!"
        />
        </router-link>


      </div>

    </q-drawer>
    <ai-assistant></ai-assistant>

    <q-page-container>
        <Suspense>
        <template #default>
          <router-view :key="$route.fullPath" />
        </template>
        <template #fallback>
          <div class="q-pa-md">Loading...</div>
        </template>
      </Suspense>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import cart from 'src/stores/cart'
import WishlistDrawer from 'src/components/WishlistDrawer.vue'
import { useQuasar } from "quasar";
import AiAssistant from "src/components/AiAssistant.vue";


const isSuperAdmin = computed(() => cart.state.user?.is_super_admin === true)

const $q = useQuasar()
const mobileMenuDrawer = ref(false)

const wishlistDrawerOpen = ref(false)
const cartDrawer = ref(false)
const toggleCart = () => (cartDrawer.value = !cartDrawer.value)
const toggleWishlistDrawer = () => (wishlistDrawerOpen.value = !wishlistDrawerOpen.value)

// Use computed getters to reactively track cart state
const cartItems = computed(() => cart.state.items)
const cartCount = computed(() => cart.state.items_count)

// Wrap cart methods so template can call directly
const increase = (id) => cart.increase(id, $q)
const decrease = (id) => cart.decrease(id, $q)
const remove = (id) => cart.remove(id, $q)

watch(() => cart.state.drawerOpen, val => {
  if(val === true) {
    cartDrawer.value = val;
    cart.state.drawerOpen = false;
  }
})

</script>