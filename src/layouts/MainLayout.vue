<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
    <div class="container">
      <q-toolbar class="flex justify-between q-pa-sm">
       <div class="flex" v-if="uiHydrated">
     <!-- Desktop Navigation -->
          <q-toolbar-title class="nav-bar" v-if="$q.screen.gt.sm">
            <router-link v-if="isSuperAdmin" to="/admin" class="text-h6 no-decoration"><q-icon :name="matAdminPanelSettings" /> Go to Admin Panel</router-link>
            <router-link to="/" class="text-h6 no-decoration">My Shop</router-link>
            <router-link to="/products/" class="text-h6 no-decoration">Products</router-link>
            <router-link to="/cart/" class="text-h6 no-decoration">Cart</router-link>
            <router-link to="/checkout/" class="text-h6 no-decoration">Checkout</router-link>
            <router-link to="/my-account/" class="text-h6 no-decoration">My account</router-link>
          </q-toolbar-title>

          <!-- Mobile Menu Toggle -->
          <q-btn flat dense :icon="matMenu" aria-label="Open menu" v-if="$q.screen.lt.md" @click="mobileMenuDrawer = true" />

       </div>
        <router-link to="/" aria-label="Navigate to home page" class="flex items-center q-mr-auto order-first">
          <svg width="180px" height="42px" style="display: block;" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.73 48"><text transform="translate(55 23.71)" style="fill:var(--q-secondary);font-family:ArialMT, Arial; font-size:26px; isolation:isolate;"><tspan x="0" y="0">NaturaBloom</tspan></text><text transform="translate(56 41.71)" style="fill:var(--q-secondary);font-family:ArialMT, Arial; font-size:12px; isolation:isolate;"><tspan x="0" y="0">Let</tspan><tspan x="16.68" y="0" style="letter-spacing:-.02em;">’</tspan><tspan x="19.13" y="0">s Bloom</tspan><tspan x="62.48" y="0" style="letter-spacing:-.02em;"> </tspan><tspan x="65.6" y="0" style="letter-spacing:-.11em;">T</tspan><tspan x="71.6" y="0">ogether</tspan></text><circle cx="24" cy="24" r="24" style="fill:#f3ece2;"/><path d="M24,10c6,10,6,18,0,28-6-10-6-18,0-28Z" style="fill:#a3c9a8;"/></svg>
        </router-link>
          <div>
          <q-btn flat dense :icon="matFavoriteBorder" aria-label="Add to wishlist" @click="toggleWishlistDrawer" class="q-ml-sm q-mr-sm">
          <q-badge v-if="storeReady && cart.state.wishlist_items && Object.keys(cart.state.wishlist_items).length > 0" floating color="red">{{ Object.keys(cart.state.wishlist_items).length }}</q-badge>
        </q-btn>

        <q-btn flat dense :icon="matShoppingCart" aria-label="View cart" @click="toggleCart">
          <q-no-ssr>
          <q-badge v-if="storeReady && cart.state.items_count > 0" floating color="red">{{ cart.state.items_count }}</q-badge>
          </q-no-ssr>
        </q-btn>
        </div>
      </q-toolbar>
     </div>
    </q-header>

    <!-- Mobile Navigation Drawer -->
    <q-drawer
        no-swipe-open
        no-swipe-close
        no-swipe-backdrop
      v-model="mobileMenuDrawer"
      side="left"
      overlay
      behavior="mobile"
      :width="260"
      transition-show="slide-right"
      transition-hide="slide-left"
      :touch-area-width="250"
      v-if="uiHydrated"
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
              <q-item-section avatar><q-icon :name="matHome" /></q-item-section>
              <q-item-section>Home</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/products/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon :name="matStorefront" /></q-item-section>
              <q-item-section>Products</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/cart/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon :name="matShoppingCart" /></q-item-section>
              <q-item-section>Cart</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/checkout/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon :name="matReceipt" /></q-item-section>
              <q-item-section>Checkout</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/my-account/" @click="mobileMenuDrawer = false">
              <q-item-section avatar><q-icon :name="matPerson" /></q-item-section>
              <q-item-section>My Account</q-item-section>
            </q-item>
          </q-list>
        </div>
        <q-banner
          v-if="supported && permission !== 'granted' && permission !== 'denied'"
          class="bg-primary text-white q-ma-md rounded-borders shadow-2"
          inline-actions
      >
        <div class="text-subtitle1">Enable push notifications?</div>
        <template v-slot:action>
          <q-btn dense color="white" text-color="primary" label="Enable" @click="handleSubscribe" />
        </template>
      </q-banner>
      </q-scroll-area>
    </q-drawer>

  <!-- Wishlist Drawer -->
  <q-drawer
      no-swipe-open
      no-swipe-close
      no-swipe-backdrop
    v-model="wishlistDrawerOpen"
    side="right"
    overlay
    behavior="mobile"
    v-if="uiHydrated"
  >
    <WishlistDrawer />
  </q-drawer>
<!-------------- ------->
    <q-drawer
        no-swipe-open
        no-swipe-close
        no-swipe-backdrop
      v-model="cartDrawer"
      side="right"
      overlay
      behavior="mobile"
      :width="300"
      :touch-area-width="250"
      v-if="uiHydrated"
    >


      <q-no-ssr>
      <q-scroll-area class="fit q-pa-sm" v-if="cart.hasItems.value">
        <h4> Cart </h4>
        <div v-for="item in cart.state.items" :key="item.id" class="q-pa-sm row items-center" :class="[item.key.includes('offline') ? 'offline-item' : '']">
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
              <q-btn dense round :icon="matRemove" @click="decrease(item.key)" :disable="item.quantity === 1" />
              <span class="q-mx-sm">{{ item.quantity }}</span>
              <q-btn dense round :icon="matAdd" @click="increase(item.id)" />
              <q-btn dense flat :icon="matClose" @click="remove(item.key, item.remote_key)" class="q-ml-sm" />
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
        </q-no-ssr>
    </q-drawer>
    <ai-assistant v-if="uiHydrated"></ai-assistant>
    <button v-else class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--rounded bg-primary text-white q-btn--actionable q-focusable q-hoverable q-btn--fab fixed-bottom-left q-mb-md q-ml-md z-max" tabindex="0" type="button" aria-label="Open chat"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon absolute" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" style="fill: none;"></path><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg></i></span></button>
    <q-page-container :style="uiHydrated ? {} : { paddingTop: '58px' }">
      <main>
        <router-view />
      </main>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import cart from 'src/stores/cart'
//import WishlistDrawer from 'src/components/WishlistDrawer.vue'
import { useQuasar } from "quasar";
//import AiAssistant from "src/components/AiAssistant.vue";
import { subscribeToWebPush } from 'src/boot/push'
import { matShoppingCart,
  matFavoriteBorder,
  matMenu,
  matHome,
  matStorefront,
  matReceipt,
  matPerson,
  matAdminPanelSettings,
  matAdd,
  matClose,
  matRemove} from '@quasar/extras/material-icons'
import { defineAsyncComponent } from 'vue'

// Explicitly define these as Async to remove them from the Critical Path
const QList = defineAsyncComponent(() => import('quasar').then(m => m.QList))
const QItem = defineAsyncComponent(() => import('quasar').then(m => m.QItem))
const QItemSection = defineAsyncComponent(() => import('quasar').then(m => m.QItemSection))
const QDrawer = defineAsyncComponent(() => import('quasar').then(m => m.QDrawer))

// Move these from standard imports to Async imports
const WishlistDrawer = defineAsyncComponent(() => import('src/components/WishlistDrawer.vue'))
const AiAssistant = defineAsyncComponent(() => import('src/components/AiAssistant.vue'))

const permission = ref('default')
const supported = ref(false)
const isSuperAdmin = computed(() => cart.state.user?.is_super_admin === true)

const $q = useQuasar()
const mobileMenuDrawer = ref(false)

const wishlistDrawerOpen = ref(false)
const cartDrawer = ref(false)

let startX = 0
let isDragging = false

// 1. Logic for START (Touch or Mouse)
const onStart = (x) => {
  if (mobileMenuDrawer.value || cartDrawer.value || wishlistDrawerOpen.value) {
    isDragging = false
    return
  }
  startX = x
  isDragging = true
}

// 2. Logic for END (Touch or Mouse)
const onEnd = (endX) => {
  if (!isDragging) return
  isDragging = false

  const dx = endX - startX
  const absX = Math.abs(dx)

  if (absX > 70) {
    if (dx > 0) {
      mobileMenuDrawer.value = true // Swipe Right
    } else {
      cartDrawer.value = true // Swipe Left
    }
  }
}

// --- EVENT WRAPPERS ---

// Mobile Handlers
const handleTouchStart = (e) => onStart(e.touches[0].clientX, e.touches[0].clientY)
const handleTouchEnd = (e) => onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)

// Desktop Handlers (Mouse)
const handleMouseDown = (e) => onStart(e.clientX, e.clientY)
const handleMouseUp = (e) => onEnd(e.clientX, e.clientY)

const toggleCart = () => (cartDrawer.value = !cartDrawer.value)
const toggleWishlistDrawer = () => (wishlistDrawerOpen.value = !wishlistDrawerOpen.value)

// Wrap cart methods so template can call directly
const increase = (id) => cart.increase(id, $q)
const decrease = (id) => cart.decrease(id, $q)
const remove = (itemKey=null, itemAPIkey=null) => cart.remove(itemKey,itemAPIkey, $q)

function onPan(evt) {
  if (evt.isFinal) {
    //if (evt.direction === 'right') cartDrawer.value = true
    const screenWidth = window.innerWidth
    const swipePercent = (evt.distance.x / screenWidth) * 100

    console.log('Swipe percent:', swipePercent)

    console.log(evt.evt.target.closest('.q-carousel'));
    if(swipePercent > 20) {
      if (evt.direction === 'left') {
        cartDrawer.value = true
        console.log(evt);

      } else if(evt.direction === 'right'){
        mobileMenuDrawer.value = true;
      }
    }
    // Do NOT call evt.preventDefault() unless you want to block child interactions
  }
}

async function handleSubscribe () {
  await subscribeToWebPush()
  permission.value = Notification.permission
}

const storeReady = ref(process.env.SERVER) // Immediate sync
const uiHydrated = ref(false)              // Deferred functional UI

onMounted(() => {
  // Phase 1: Show the badges immediately
  storeReady.value = true

  // Phase 2: Wait for the Hero to paint, then load the heavy stuff
  const scheduler = async() => {
    uiHydrated.value = true
    if ('Notification' in window) {
      supported.value = true
      permission.value = Notification.permission
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })

    window.removeEventListener('scroll', scheduler)
    window.removeEventListener('mousemove', scheduler)
    window.removeEventListener('touchstart', scheduler)

  }
  window.addEventListener('scroll', scheduler, {passive: true})
  window.addEventListener('mousemove', scheduler, {passive: true})
  window.addEventListener('touchstart', scheduler, {passive: true})

  // Safety fallback: Hydrate after 5 seconds if no interaction
  setTimeout(scheduler, 5000)

})
onUnmounted(() => {
  // Critical cleanup
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mouseup', handleMouseUp)
})
watch(() => cart.state.drawerOpen, val => {
  if(val === true) {
    cartDrawer.value = val;
    cart.state.drawerOpen = false;
    //cart.fetchCart()
  }
})

</script>