<template>
  <div v-if="!uiHydrated" class="minimal-fallback">
<header class="q-header q-layout__section--marginal fixed-top"><div class="container">
  <div class="q-toolbar row no-wrap items-center flex justify-between q-pa-sm" role="toolbar">
    <div class="flex"><!-- Desktop Navigation -->
      <div class="q-toolbar__title ellipsis nav-bar gt-sm"><!--v-if-->
        <a aria-current="page" href="/" class="router-link-active router-link-exact-active text-h6 no-decoration">My Shop</a>
        <a href="/products/" class="text-h6 no-decoration">Products</a>
        <a href="/cart/" class="text-h6 no-decoration">Cart</a>
        <a href="/checkout/" class="text-h6 no-decoration">Checkout</a>
        <a href="/my-account/" class="text-h6 no-decoration">My account</a>
      </div><!-- Mobile Menu Toggle -->
      <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense lt-md" tabindex="0" type="button" aria-label="Open menu" fdprocessedid="hib2pl">
        <span class="q-focus-helper"></span>
        <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
          <i class="q-icon" aria-hidden="true" role="img">
            <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" style="fill: none;"></path><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
          </i></span>
      </button>
    </div>
    <a aria-current="page" href="/" class="router-link-active router-link-exact-active flex items-center q-mr-auto order-first" aria-label="Navigate to home page"><svg width="180px" height="42px" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 206.73 48" style="display: block;"><text transform="translate(55 23.71)" style="fill: var(--q-secondary); font-family: ArialMT, Arial; font-size: 26px; isolation: isolate;"><tspan x="0" y="0">NaturaBloom</tspan></text><text transform="translate(56 41.71)" style="fill: var(--q-secondary); font-family: ArialMT, Arial; font-size: 12px; isolation: isolate;"><tspan x="0" y="0">Let</tspan><tspan x="16.68" y="0" style="letter-spacing: -0.02em;">’</tspan><tspan x="19.13" y="0">s Bloom</tspan><tspan x="62.48" y="0" style="letter-spacing: -0.02em;"></tspan><tspan x="65.6" y="0" style="letter-spacing: -0.11em;">T</tspan><tspan x="71.6" y="0">ogether</tspan></text><circle cx="24" cy="24" r="24" style="fill: rgb(243, 236, 226);"></circle><path d="M24,10c6,10,6,18,0,28-6-10-6-18,0-28Z" style="fill: rgb(163, 201, 168);"></path></svg></a>
    <div>
      <button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense q-ml-sm q-mr-sm" tabindex="0" type="button" aria-label="Add to wishlist" fdprocessedid="pf8ulp">
        <span class="q-focus-helper"></span>
        <span class="q-btn__content text-center col items-center q-anchor--skip justify-center row">
          <i class="q-icon" aria-hidden="true" role="img">
            <svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" style="fill: none;"></path><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg></i>
        </span></button><button class="q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--dense" tabindex="0" type="button" aria-label="View cart" fdprocessedid="m7wgaa"><span class="q-focus-helper"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon" aria-hidden="true" role="img"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" style="fill: none;"></path><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path></svg></i>
    </span>
    </button>
    </div>
  </div>
</div>
<!---->
</header>

    <main>
      <div style="padding-top: 58px">
    <router-view />
        </div>
    </main>
  </div>

  <q-layout view="hHh lpR fFf" v-else>
    <q-header>
    <div class="container">
      <q-toolbar class="flex justify-between q-pa-sm">
       <div class="flex nav-items-el" v-if="uiHydrated">
     <!-- Desktop Navigation -->
          <q-toolbar-title class="nav-bar gt-sm">
            <router-link v-if="isSuperAdmin" to="/admin" class="text-h6 no-decoration"><q-icon :name="matAdminPanelSettings" /> Go to Admin Panel</router-link>
            <router-link to="/" class="text-h6 no-decoration">My Shop</router-link>
            <router-link to="/products/" class="text-h6 no-decoration">Products</router-link>
            <router-link to="/cart/" class="text-h6 no-decoration">Cart</router-link>
            <router-link to="/checkout/" class="text-h6 no-decoration">Checkout</router-link>
            <router-link to="/my-account/" class="text-h6 no-decoration">My account</router-link>
          </q-toolbar-title>

          <!-- Mobile Menu Toggle -->
          <q-btn flat dense :icon="matMenu" aria-label="Open menu" class="lt-md" @click="mobileMenuDrawer = true" />

       </div>
        <router-link to="/" aria-label="Navigate to home page" class="flex items-center order-first">
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
          <q-btn dense color="white" text-color="secondary" label="Enable" @click="handleSubscribe" />
        </template>
      </q-banner>
      </q-scroll-area>
    </q-drawer>

  <!-- Wishlist Drawer -->
  <q-drawer
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
      v-model="cartDrawer"
      side="right"
      overlay
      behavior="mobile"
      :width="300"
      :touch-area-width="250"
      v-if="uiHydrated"
    >
      <q-no-ssr>
      <q-scroll-area class="fit q-pa-sm">
        <h4> Cart </h4>
        <div v-if="cart.hasItems.value">
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
          color="secondary"
          label="Checkout"
        />
        </router-link>

        </div>
        <div v-else class="q-pa-sm row items-center">
          <h5>seems like your cart is empty</h5>
          <router-link to="/products/">
            <q-btn
                color="secondary"
                label="Shop now!"
            />
          </router-link>
        </div>

      </q-scroll-area>
       </q-no-ssr>
    </q-drawer>
    <ai-assistant v-if="uiHydrated"></ai-assistant>
    <button v-else class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--rounded bg-primary text-white q-btn--actionable q-focusable q-hoverable q-btn--fab fixed-bottom-left q-mb-md q-ml-md z-max" tabindex="0" type="button" aria-label="Open chat"><span class="q-focus-helper" tabindex="-1"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon absolute" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" style="fill: none;"></path><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg></i></span></button>
    <q-page-container :style="uiHydrated ? {} : { paddingTop: '58px' }">
      <main>
        <router-view />
      </main>
    </q-page-container>

    <footer>
      <div class="container flex justify-between">
        <div class="footer-column first">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="15" viewBox="0 0 108 15" fill="none"><path d="M10.7031 1.55273L8.94531 1.29883V0.78125H13.4082V1.29883L11.7285 1.55273V13.877H10.7812L2.70508 2.09961V13.0957L4.46289 13.3594V13.877H0V13.3594L1.67969 13.0957V1.55273L0 1.29883V0.78125H3.96484L10.7031 10.4785V1.55273ZM18.4082 4.49219C18.8249 4.49219 19.2122 4.53125 19.5703 4.60938C19.9284 4.6875 20.2376 4.82096 20.498 5.00977C20.7585 5.19857 20.9619 5.4541 21.1084 5.77637C21.2549 6.09863 21.3281 6.50391 21.3281 6.99219V13.1934L22.4707 13.4375V13.877H19.9512L19.7656 12.959C19.668 13.0566 19.5361 13.1706 19.3701 13.3008C19.2041 13.431 19.0039 13.5531 18.7695 13.667C18.5352 13.7809 18.2633 13.877 17.9541 13.9551C17.6449 14.0332 17.3014 14.0723 16.9238 14.0723C16.4811 14.0723 16.1084 14.0039 15.8057 13.8672C15.5029 13.7305 15.2604 13.54 15.0781 13.2959C14.8958 13.0518 14.7656 12.762 14.6875 12.4268C14.6094 12.0915 14.5703 11.7285 14.5703 11.3379C14.5703 10.9342 14.6191 10.5843 14.7168 10.2881C14.8145 9.99186 14.9512 9.74284 15.127 9.54102C15.3027 9.33919 15.5094 9.1748 15.7471 9.04785C15.9847 8.9209 16.2419 8.82161 16.5186 8.75C16.7952 8.67839 17.0882 8.62956 17.3975 8.60352C17.7067 8.57747 18.0176 8.5612 18.3301 8.55469L19.707 8.51562V7.08008C19.707 6.80664 19.6842 6.55762 19.6387 6.33301C19.5931 6.1084 19.5166 5.91471 19.4092 5.75195C19.3018 5.58919 19.1569 5.46224 18.9746 5.37109C18.7923 5.27995 18.5645 5.23438 18.291 5.23438C17.9785 5.23438 17.6628 5.27669 17.3438 5.36133C17.0247 5.44596 16.7448 5.55664 16.5039 5.69336L16.1719 6.83594H15.625V4.83398C16.0482 4.74284 16.486 4.66309 16.9385 4.59473C17.391 4.52637 17.8809 4.49219 18.4082 4.49219ZM19.707 9.19922L18.4277 9.23828C18.0436 9.2513 17.7116 9.28874 17.4316 9.35059C17.1517 9.41243 16.9206 9.51823 16.7383 9.66797C16.556 9.81771 16.4193 10.0228 16.3281 10.2832C16.237 10.5436 16.1914 10.8757 16.1914 11.2793C16.1914 12.4251 16.6569 12.998 17.5879 12.998C18.0306 12.998 18.4131 12.9476 18.7354 12.8467C19.0576 12.7458 19.3815 12.6172 19.707 12.4609V9.19922ZM26.0059 14.0723C25.3809 14.0723 24.9137 13.8867 24.6045 13.5156C24.2952 13.1445 24.1406 12.6237 24.1406 11.9531V5.51758H22.9395V5.07812L24.1602 4.69727L25.1465 2.61719H25.7617V4.69727H27.8613V5.51758H25.7617V11.7773C25.7617 12.2005 25.8577 12.5195 26.0498 12.7344C26.2419 12.9492 26.4941 13.0566 26.8066 13.0566C27.0475 13.0566 27.2868 13.0404 27.5244 13.0078C27.762 12.9753 27.9818 12.9395 28.1836 12.9004V13.5352C28.0859 13.6003 27.9574 13.6654 27.7979 13.7305C27.6383 13.7956 27.4626 13.8525 27.2705 13.9014C27.0785 13.9502 26.875 13.9909 26.6602 14.0234C26.4453 14.056 26.2272 14.0723 26.0059 14.0723ZM31.3574 11.2598C31.3574 11.8001 31.4795 12.2152 31.7236 12.5049C31.9678 12.7946 32.3665 12.9395 32.9199 12.9395C33.2845 12.9395 33.6621 12.915 34.0527 12.8662C34.4434 12.8174 34.821 12.7409 35.1855 12.6367V5.38086L33.7988 5.13672V4.69727H36.7969V13.1934L37.959 13.4375V13.877H35.2832L35.2051 13.1348C35.0163 13.2389 34.7917 13.3464 34.5312 13.457C34.2708 13.5677 33.999 13.6686 33.7158 13.7598C33.4326 13.8509 33.1478 13.9258 32.8613 13.9844C32.5749 14.043 32.3145 14.0723 32.0801 14.0723C31.7285 14.0723 31.4095 14.0234 31.123 13.9258C30.8366 13.8281 30.5908 13.6719 30.3857 13.457C30.1807 13.2422 30.0212 12.9639 29.9072 12.6221C29.7933 12.2803 29.7363 11.8652 29.7363 11.377V5.38086L28.5645 5.13672V4.69727H31.3574V11.2598ZM44.7852 4.45312V6.93359H44.3652L43.7988 5.85938C43.6165 5.85938 43.4212 5.8724 43.2129 5.89844C43.0046 5.92448 42.7962 5.95866 42.5879 6.00098C42.3796 6.04329 42.1794 6.09375 41.9873 6.15234C41.7952 6.21094 41.6276 6.27279 41.4844 6.33789V13.1934L43.0566 13.4375V13.877H38.7012V13.4375L39.8633 13.1934V5.38086L38.7012 5.13672V4.69727H41.377L41.4648 5.83984C41.6146 5.71615 41.8197 5.57454 42.0801 5.41504C42.3405 5.25553 42.6221 5.10417 42.9248 4.96094C43.2275 4.81771 43.5303 4.69727 43.833 4.59961C44.1357 4.50195 44.4043 4.45312 44.6387 4.45312H44.7852ZM49.502 4.49219C49.9186 4.49219 50.306 4.53125 50.6641 4.60938C51.0221 4.6875 51.3314 4.82096 51.5918 5.00977C51.8522 5.19857 52.0557 5.4541 52.2021 5.77637C52.3486 6.09863 52.4219 6.50391 52.4219 6.99219V13.1934L53.5645 13.4375V13.877H51.0449L50.8594 12.959C50.7617 13.0566 50.6299 13.1706 50.4639 13.3008C50.2979 13.431 50.0977 13.5531 49.8633 13.667C49.6289 13.7809 49.3571 13.877 49.0479 13.9551C48.7386 14.0332 48.3952 14.0723 48.0176 14.0723C47.5749 14.0723 47.2021 14.0039 46.8994 13.8672C46.5967 13.7305 46.3542 13.54 46.1719 13.2959C45.9896 13.0518 45.8594 12.762 45.7812 12.4268C45.7031 12.0915 45.6641 11.7285 45.6641 11.3379C45.6641 10.9342 45.7129 10.5843 45.8105 10.2881C45.9082 9.99186 46.0449 9.74284 46.2207 9.54102C46.3965 9.33919 46.6032 9.1748 46.8408 9.04785C47.0785 8.9209 47.3356 8.82161 47.6123 8.75C47.889 8.67839 48.182 8.62956 48.4912 8.60352C48.8005 8.57747 49.1113 8.5612 49.4238 8.55469L50.8008 8.51562V7.08008C50.8008 6.80664 50.778 6.55762 50.7324 6.33301C50.6868 6.1084 50.6104 5.91471 50.5029 5.75195C50.3955 5.58919 50.2507 5.46224 50.0684 5.37109C49.8861 5.27995 49.6582 5.23438 49.3848 5.23438C49.0723 5.23438 48.7565 5.27669 48.4375 5.36133C48.1185 5.44596 47.8385 5.55664 47.5977 5.69336L47.2656 6.83594H46.7188V4.83398C47.1419 4.74284 47.5798 4.66309 48.0322 4.59473C48.4847 4.52637 48.9746 4.49219 49.502 4.49219ZM50.8008 9.19922L49.5215 9.23828C49.1374 9.2513 48.8053 9.28874 48.5254 9.35059C48.2454 9.41243 48.0143 9.51823 47.832 9.66797C47.6497 9.81771 47.513 10.0228 47.4219 10.2832C47.3307 10.5436 47.2852 10.8757 47.2852 11.2793C47.2852 12.4251 47.7507 12.998 48.6816 12.998C49.1243 12.998 49.5068 12.9476 49.8291 12.8467C50.1514 12.7458 50.4753 12.6172 50.8008 12.4609V9.19922ZM63.1934 3.95508C63.1934 3.57096 63.1364 3.23568 63.0225 2.94922C62.9085 2.66276 62.7246 2.4235 62.4707 2.23145C62.2168 2.03939 61.888 1.89616 61.4844 1.80176C61.0807 1.70736 60.5859 1.66016 60 1.66016H57.9785V6.61133H60.1172C60.7227 6.61133 61.224 6.54785 61.6211 6.4209C62.0182 6.29395 62.3324 6.11491 62.5635 5.88379C62.7946 5.65267 62.9574 5.37435 63.0518 5.04883C63.1462 4.72331 63.1934 4.35872 63.1934 3.95508ZM64.1797 10.1465C64.1797 9.69076 64.1064 9.29688 63.96 8.96484C63.8135 8.63281 63.5856 8.35775 63.2764 8.13965C62.9671 7.92155 62.5684 7.75879 62.0801 7.65137C61.5918 7.54395 61.0059 7.49023 60.3223 7.49023H57.9785V12.998C58.278 13.0111 58.5905 13.0208 58.916 13.0273C59.196 13.0404 59.5052 13.0485 59.8438 13.0518C60.1823 13.055 60.5176 13.0566 60.8496 13.0566C61.4616 13.0566 61.9792 12.9883 62.4023 12.8516C62.8255 12.7148 63.1689 12.5212 63.4326 12.2705C63.6963 12.0199 63.8867 11.7155 64.0039 11.3574C64.1211 10.9993 64.1797 10.5957 64.1797 10.1465ZM54.4141 13.877V13.3594L56.0938 13.0957V1.55273L54.4141 1.29883V0.78125H60.4004C61.3184 0.78125 62.0833 0.851237 62.6953 0.991211C63.3073 1.13118 63.7988 1.33464 64.1699 1.60156C64.541 1.86849 64.8047 2.19238 64.9609 2.57324C65.1172 2.9541 65.1953 3.38216 65.1953 3.85742C65.1953 4.26758 65.1286 4.64193 64.9951 4.98047C64.8617 5.31901 64.6761 5.61686 64.4385 5.87402C64.2008 6.13118 63.916 6.34603 63.584 6.51855C63.252 6.69108 62.8906 6.81966 62.5 6.9043C63.0664 6.96289 63.5791 7.07682 64.0381 7.24609C64.4971 7.41536 64.8861 7.63509 65.2051 7.90527C65.5241 8.17546 65.7699 8.49609 65.9424 8.86719C66.1149 9.23828 66.2012 9.65169 66.2012 10.1074C66.2012 10.6738 66.1051 11.193 65.9131 11.665C65.721 12.137 65.4199 12.5407 65.0098 12.876C64.5996 13.2113 64.0723 13.4717 63.4277 13.6572C62.7832 13.8428 62.0052 13.9355 61.0938 13.9355C60.3646 13.9355 59.6387 13.9258 58.916 13.9062C58.1934 13.8867 57.526 13.877 56.9141 13.877H54.4141ZM70.7617 13.1934L72.334 13.4375V13.877H67.5781V13.4375L69.1406 13.1934V0.673828L67.5781 0.439453V0H70.7617V13.1934ZM81.9727 9.23828C81.9727 10.7943 81.6243 11.9889 80.9277 12.8223C80.2311 13.6556 79.1471 14.0723 77.6758 14.0723C76.2956 14.0723 75.2539 13.6589 74.5508 12.832C73.8477 12.0052 73.4961 10.8073 73.4961 9.23828C73.4961 7.6888 73.8477 6.50391 74.5508 5.68359C75.2539 4.86328 76.3216 4.45312 77.7539 4.45312C79.1471 4.45312 80.1986 4.85514 80.9082 5.65918C81.6178 6.46322 81.9727 7.65625 81.9727 9.23828ZM80.2148 9.23828C80.2148 8.60677 80.1725 8.04199 80.0879 7.54395C80.0033 7.0459 79.8617 6.62598 79.6631 6.28418C79.4645 5.94238 79.2025 5.68197 78.877 5.50293C78.5514 5.32389 78.151 5.23438 77.6758 5.23438C77.194 5.23438 76.7969 5.32389 76.4844 5.50293C76.1719 5.68197 75.9245 5.94238 75.7422 6.28418C75.5599 6.62598 75.4329 7.0459 75.3613 7.54395C75.2897 8.04199 75.2539 8.60677 75.2539 9.23828C75.2539 9.8763 75.2897 10.446 75.3613 10.9473C75.4329 11.4486 75.5599 11.8734 75.7422 12.2217C75.9245 12.57 76.1719 12.8369 76.4844 13.0225C76.7969 13.208 77.194 13.3008 77.6758 13.3008C78.151 13.3008 78.5514 13.208 78.877 13.0225C79.2025 12.8369 79.4645 12.57 79.6631 12.2217C79.8617 11.8734 80.0033 11.4486 80.0879 10.9473C80.1725 10.446 80.2148 9.8763 80.2148 9.23828ZM91.9727 9.23828C91.9727 10.7943 91.6243 11.9889 90.9277 12.8223C90.2311 13.6556 89.1471 14.0723 87.6758 14.0723C86.2956 14.0723 85.2539 13.6589 84.5508 12.832C83.8477 12.0052 83.4961 10.8073 83.4961 9.23828C83.4961 7.6888 83.8477 6.50391 84.5508 5.68359C85.2539 4.86328 86.3216 4.45312 87.7539 4.45312C89.1471 4.45312 90.1986 4.85514 90.9082 5.65918C91.6178 6.46322 91.9727 7.65625 91.9727 9.23828ZM90.2148 9.23828C90.2148 8.60677 90.1725 8.04199 90.0879 7.54395C90.0033 7.0459 89.8617 6.62598 89.6631 6.28418C89.4645 5.94238 89.2025 5.68197 88.877 5.50293C88.5514 5.32389 88.151 5.23438 87.6758 5.23438C87.194 5.23438 86.7969 5.32389 86.4844 5.50293C86.1719 5.68197 85.9245 5.94238 85.7422 6.28418C85.5599 6.62598 85.4329 7.0459 85.3613 7.54395C85.2897 8.04199 85.2539 8.60677 85.2539 9.23828C85.2539 9.8763 85.2897 10.446 85.3613 10.9473C85.4329 11.4486 85.5599 11.8734 85.7422 12.2217C85.9245 12.57 86.1719 12.8369 86.4844 13.0225C86.7969 13.208 87.194 13.3008 87.6758 13.3008C88.151 13.3008 88.5514 13.208 88.877 13.0225C89.2025 12.8369 89.4645 12.57 89.6631 12.2217C89.8617 11.8734 90.0033 11.4486 90.0879 10.9473C90.1725 10.446 90.2148 9.8763 90.2148 9.23828ZM95.918 5.43945C96.1003 5.33529 96.3167 5.22461 96.5674 5.10742C96.818 4.99023 97.0768 4.88281 97.3438 4.78516C97.6107 4.6875 97.8809 4.60775 98.1543 4.5459C98.4277 4.48405 98.6816 4.45312 98.916 4.45312C99.3652 4.45312 99.7803 4.53776 100.161 4.70703C100.542 4.8763 100.827 5.14648 101.016 5.51758C101.224 5.40039 101.475 5.27832 101.768 5.15137C102.061 5.02441 102.365 4.90885 102.681 4.80469C102.996 4.70052 103.309 4.61589 103.618 4.55078C103.927 4.48568 104.206 4.45312 104.453 4.45312C104.805 4.45312 105.124 4.50195 105.41 4.59961C105.697 4.69727 105.942 4.85352 106.147 5.06836C106.353 5.2832 106.512 5.56315 106.626 5.9082C106.74 6.25326 106.797 6.66992 106.797 7.1582V13.1934L107.979 13.4375V13.877H103.809V13.4375L105.176 13.1934V7.33398C105.176 6.79362 105.054 6.37858 104.81 6.08887C104.565 5.79915 104.167 5.6543 103.613 5.6543C103.444 5.6543 103.247 5.66732 103.022 5.69336C102.798 5.7194 102.573 5.7487 102.349 5.78125C102.124 5.8138 101.909 5.85124 101.704 5.89355C101.499 5.93587 101.328 5.97005 101.191 5.99609C101.302 6.34766 101.357 6.73503 101.357 7.1582V13.1934L102.734 13.4375V13.877H98.3789V13.4375L99.7363 13.1934V7.33398C99.7363 6.79362 99.598 6.37858 99.3213 6.08887C99.0446 5.79915 98.6296 5.6543 98.0762 5.6543C97.8939 5.6543 97.7035 5.66406 97.5049 5.68359C97.3063 5.70312 97.111 5.72591 96.9189 5.75195C96.7269 5.77799 96.5446 5.80892 96.3721 5.84473C96.1995 5.88053 96.0547 5.91146 95.9375 5.9375V13.1934L97.3145 13.4375V13.877H93.1543V13.4375L94.3164 13.1934V5.38086L93.1543 5.13672V4.69727H95.8398L95.918 5.43945Z" fill="#064E3B"/></svg>
          <p>Crafting botanical excellence for the modern soul. Pure ingredients, ethical processes, lasting radiance.</p>
        </div>
        <div class="footer-column">
          <h5 class="links-title">Shop</h5>
          <nav>
            <router-link to="/products">Shop All</router-link>
            <router-link to="/product-category/best-sellers">Best Sellers</router-link>
            <router-link to="/product-category/new-arrival">New Arrival</router-link>
            <router-link to="/gift-card">Gift Card</router-link>
          </nav>
        </div>
        <div class="footer-column">
          <h5 class="links-title">Experience</h5>
          <nav>
            <router-link to="/sustainability">Sustainability</router-link>
            <router-link to="/our-story">Our Story</router-link>
          </nav>
        </div>
        <div class="footer-column">
          <h5 class="links-title">Support</h5>
          <nav>
            <router-link to="/shipping-and-returns">Shipping & Returns</router-link>
            <router-link to="/privacy-policy">Privacy Policy</router-link>
            <router-link to="/terms-of-service">Terms of Service</router-link>
            <router-link to="/contact-us">Contact Us</router-link>
          </nav>
        </div>
        <div class="footer-bottom">
          <span>All right reserved</span>
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import cart from 'src/stores/cart'
import WishlistDrawer from 'src/components/WishlistDrawer.vue'
import { useRoute, useRouter } from 'vue-router'
import { Platform } from 'quasar';
import AiAssistant from "src/components/AiAssistant.vue";
import initPush, { subscribeToWebPush, initNativePush, checkNativePermission } from 'src/boot/push.js'
import { initLoadingBar } from 'boot/loading-bar'

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
//import { defineAsyncComponent } from 'vue'

function normalizePermission(value) {
  if (value === 'prompt') { return 'default' } else if (value === 'initialized') { return 'granted' }
  return value
}

// Explicitly define these as Async to remove them from the Critical Path
/* eslint-disable no-unused-vars */
const _responsiveClasses = 'gt-sm lt-md gt-md lt-sm'
/*const QList = defineAsyncComponent(() => import('quasar/src/components/item/QList.js'))
const QItem = defineAsyncComponent(() => import('quasar/src/components/item/QItem.js'))
const QItemSection = defineAsyncComponent(() => import('quasar/src/components/item/QItemSection.js'))
const QHeader = defineAsyncComponent(() => import('quasar/src/components/header/QHeader.js'))
const QDrawer = defineAsyncComponent(() => import('quasar/src/components/drawer/QDrawer.js'))
const QLayout = defineAsyncComponent(() => import('quasar/src/components/layout/QLayout.js'))
const QPageContainer = defineAsyncComponent(() => import('quasar/src/components/page/QPageContainer.js'))
const QScrollObserver = defineAsyncComponent(() => import('quasar/src/components/scroll-observer/QScrollObserver.js'))
const QResizeObserver = defineAsyncComponent(() => import('quasar/src/components/resize-observer/QResizeObserver.js'))
const QToolbar = defineAsyncComponent(() => import('quasar/src/components/toolbar/QToolbar.js'))
const QToolbarTitle = defineAsyncComponent(() => import('quasar/src/components/toolbar/QToolbarTitle.js'))
*/
/* eslint-enable no-unused-vars */

// Move these from standard imports to Async imports
//const WishlistDrawer = defineAsyncComponent(() => import('src/components/WishlistDrawer.vue'))
//const AiAssistant = defineAsyncComponent(() => import('src/components/AiAssistant.vue'))

const permission = ref('default')
const supported = ref(false)
const isSuperAdmin = computed(() => cart.state.user?.is_super_admin === true)

//const $q = useQuasar()
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
const increase = (id) => cart.increase(id)
const decrease = (id) => cart.decrease(id)
const remove = (itemKey=null, itemAPIkey=null) => cart.remove(itemKey,itemAPIkey)

/*function onPan(evt) {
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
}*/

async function handleSubscribe() {
  if (Platform.is.capacitor) {
    try {
      // request permission via the boot helper (user gesture)
      const result = await initNativePush()
      permission.value = normalizePermission(result)
      alert('Permission status: ' + result)
    } catch (e) {
      console.error('Native permission error', e)
    }
  } else {
    await subscribeToWebPush()
    permission.value = Notification.permission
  }
}

const storeReady = ref(process.env.SERVER) // Immediate sync
const uiHydrated = ref(false)              // Deferred functional UI
const route = useRoute()
const router = useRouter()

const noDelayRoutes = ['/checkout', '/cart']

const shouldDelayHydration = computed(() => {
  return !noDelayRoutes.includes(route.path)
})

onMounted(() => {
  // Phase 1: Show the badges immediately
  storeReady.value = true

  const headerBtnClick = async(e) => {
    await scheduler()
    const btn = e.target.closest('[aria-label]');
    if (btn) {
      const label = btn.getAttribute('aria-label');
      requestAnimationFrame(() => {
        // Check for your specific button labels
        if (label === 'Open menu') {
          mobileMenuDrawer.value = true
        } else if (label === 'Add to wishlist') {
          wishlistDrawerOpen.value = true
        } else if (label === 'View cart') {
          cartDrawer.value = true
        }
      });
    }
  }
  document.querySelector('header').addEventListener('click', headerBtnClick, {passive: true});
  // Phase 2: Wait for the Hero to paint, then load the heavy stuff
  const scheduler = async () => {

    if (uiHydrated.value) return

// 2. Immediate cleanup of listeners
    window.removeEventListener('scroll', scheduler)
    window.removeEventListener('mousemove', scheduler)
    window.removeEventListener('touchstart', scheduler)
    window.removeEventListener('click', headerBtnClick);

    // 1. Pre-load the heavy scripts in the background
    // This happens while the user is looking at the static SSR page
    try {
      // We dynamic-import the utility, which then dynamic-imports Quasar.
      // This 'double-hop' usually breaks the auto-preload scanner.
      const {hydrate} = await import('../utils/lazy-quasar.js')
      await hydrate()

      requestAnimationFrame(() => {
        uiHydrated.value = true
      })
    } catch (e) {
      console.error("Hydration prefetch failed", e)
      uiHydrated.value = true // Fallback
    }

    initLoadingBar(router)
    // 1. ALWAYS initialize tracking (Abandoned Cart logic)
    // This doesn't ask for permission, it just sets up listeners.
    if ( typeof window !== 'undefined' || Platform.is.capacitor ) {
      initPush()
      const initialPermissions = await checkNativePermission();
      permission.value = normalizePermission(initialPermissions)
      console.log('🛒 Cart tracking active');
    }


    if (Platform.is.capacitor) {
      supported.value = true
      /*const result = await initNativePush()
      permission.value = normalizePermission(result)*/
    } else if ('Notification' in window) {
      supported.value = true
      permission.value = normalizePermission(Notification.permission)
    }

    window.addEventListener('touchstart', handleTouchStart, {passive: true})
    window.addEventListener('touchend', handleTouchEnd, {passive: true})
    window.addEventListener('mousedown', handleMouseDown, {passive: true})
    window.addEventListener('mouseup', handleMouseUp, {passive: true})

  }
    // 🚨 THIS IS THE IMPORTANT PART
  if (!shouldDelayHydration.value) {
    // 👉 hydrate immediately
    scheduler()
    return
  } else {
    window.addEventListener('scroll', scheduler, {passive: true})
    window.addEventListener('mousemove', scheduler, {passive: true})
    window.addEventListener('touchstart', scheduler, {passive: true})

    // Safety fallback: Hydrate after 5 seconds if no interaction
    setTimeout(scheduler, 3000)
  }

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