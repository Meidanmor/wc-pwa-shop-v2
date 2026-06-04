<!-- AccountPage.vue -->
<template>
  <div class="q-pa-md">
    <div class="container">
      <h2>My account</h2>

      <!-- Checking session on mount -->
      <div v-if="sessionLoading">
        <q-spinner color="secondary" size="2em" />
      </div>

      <!-- Not logged in -->
      <div v-else-if="!isLoggedIn">
        <LoginForm @login-success="onLogin" />
        <h3>OR</h3>
        <GoogleLoginButton />
      </div>

      <!-- Logged in -->
      <div v-else>
        <q-tabs
          @touchstart.stop
          @mousedown.stop
          :right-icon="matChevronLeft"
          :left-icon="matChevronRight"
          v-model="tab"
          class="text-secondary"
          active-bg-color="secondary"
          active-color="primary"
          align="justify"
        >
          <q-tab name="dashboard" label="Dashboard" />
          <q-tab name="orders"    label="My Orders" />
          <q-tab name="details"   label="Account Details" />
          <q-tab name="logout"    label="Logout" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

          <q-tab-panel name="dashboard">
            <h2 class="text-h4">Dashboard</h2>
            <div v-if="userData">
              Welcome, {{ userData.first_name }} {{ userData.last_name }}
            </div>
            <div v-else>
              <q-spinner color="secondary" size="2em" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="orders">
            <!-- TODO: update OrdersSection to drop the token prop
                 once that component is migrated to cookie auth -->
            <OrdersSection />
          </q-tab-panel>

          <q-tab-panel name="details">
            <AccountDetails v-if="userData" :user="userData" />
          </q-tab-panel>

          <q-tab-panel name="logout">
            <q-btn @click="logout" :loading="logoutLoading" label="Logout" />
            <div v-if="logoutError" class="text-negative q-mt-md">{{ logoutError }}</div>
          </q-tab-panel>

        </q-tab-panels>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWithToken, setLoggedIn, getWasLoggedIn } from 'src/composables/useApiFetch.js'
import LoginForm          from 'components/LoginForm.vue'
import OrdersSection      from 'components/OrdersSection.vue'
import AccountDetails     from 'components/AccountDetails.vue'
import GoogleLoginButton  from 'src/components/GoogleLoginButton.vue'
import cart               from 'src/stores/cart.js'
import { matChevronLeft, matChevronRight } from '@quasar/extras/material-icons'

const API = import.meta.env.VITE_API_BASE

const tab           = ref('dashboard')
const userData      = ref(null)
const isLoggedIn    = ref(false)
const sessionLoading = ref(true)  // true while we check the session on mount
const logoutLoading  = ref(false)
const logoutError    = ref('')

// ─── Check session on mount ───────────────────────────────────────────────────
// We can't rely on localStorage anymore — the only source of truth is whether
// the WP session cookie is still valid. A GET /qwoo/v1/me call tells us that.
let sessionChecked = false;
onMounted(async () => {
  if (sessionChecked) return
  sessionChecked = true

  console.log(document.cookie)
  if (!getWasLoggedIn()) {
    sessionLoading.value = false  // show login form immediately
    return
  }

  // cookie exists → verify session is still valid
  try {
    const res = await fetchWithToken(`${API}/wp-json/qwoo/v1/me`)
    if (res.ok) {
      const data = await res.json()
      userData.value   = data.user
      cart.state.user  = data.user
      setLoggedIn(true)
      isLoggedIn.value = true
    }
  } catch (err) {
    console.error('Session check failed:', err)
  } finally {
    sessionLoading.value = false
  }
})

// ─── After login ──────────────────────────────────────────────────────────────
// LoginForm now emits the user object directly (not a token)

function onLogin(user) {
  userData.value   = user
  cart.state.user  = user
  setLoggedIn(true)
  isLoggedIn.value = true
}

// ─── Logout ───────────────────────────────────────────────────────────────────
// Must call the server to expire the session cookie — the frontend
// cannot clear an HttpOnly cookie on its own.

async function logout() {
  logoutError.value   = ''
  logoutLoading.value = true

  try {
    await fetchWithToken(`${API}/wp-json/qwoo/v1/logout`, { method: 'POST' })
  } catch (err) {
    console.error('Logout request failed:', err)
    logoutError.value = 'Logout failed. Please try again.'
    return
  } finally {
    logoutLoading.value = false
  }

  // Clear local state regardless of server response
  userData.value   = null
  isLoggedIn.value = false
  setLoggedIn(false)
  cart.clear()
  cart.state.user  = {}
}
</script>

<style scoped>
/* purgecss start ignore */
.q-field__label {
  transition: 0.3s ease;
}
.q-field--focused .q-field__label,
.q-field--float .q-field__label {
  font-size: 10px;
  transform: translateY(-5px);
}
div.q-tab-panels {
  background: transparent;
}
/* purgecss end ignore */
</style>