<!-- AccountPage.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="container">
    <h2>My account</h2>

    <div v-if="!isLoggedIn">
      <LoginForm @login-success="onLogin" />
      <h3> OR </h3>
      <GoogleLoginButton/>
    </div>

    <div v-else>
      <q-tabs v-model="tab" class="text-primary" active-color="primary" align="justify">
        <q-tab name="dashboard" label="Dashboard" />
        <q-tab name="orders" label="My Orders" />
        <q-tab name="details" label="Account Details" />
        <q-tab name="logout" label="Logout" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="dashboard">
          <h2 class="text-h4">Dashboard</h2>
          <div v-if="userData">Welcome, {{ userData?.first__name }} {{ userData?.last__name }}</div>
          <div v-else> <q-spinner color="primary" size="2em" /> </div>
        </q-tab-panel>
        <q-tab-panel name="orders"><OrdersSection :token="token" /></q-tab-panel>
        <q-tab-panel name="details"><AccountDetails :token="token" /></q-tab-panel>
        <q-tab-panel name="logout"><q-btn @click="logout">Logout</q-btn></q-tab-panel>
      </q-tab-panels>
    </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoginForm from 'components/LoginForm.vue'
import OrdersSection from 'components/OrdersSection.vue'
import AccountDetails from 'components/AccountDetails.vue'
import cart from 'src/stores/cart.js';
import GoogleLoginButton from 'src/components/GoogleLoginButton.vue';


const tab = ref('dashboard')

const userData = ref(null)
const token = ref(null)

if(process.env.CLIENT) {
  token.value = localStorage.getItem('jwt_token')
}
  const isLoggedIn = ref(!!token.value)

  async function onLogin(newToken) {
    token.value = newToken
    if(process.env.CLIENT) {

      localStorage.setItem('jwt_token', newToken)
    }
    //alert(localStorage.getItem('jwt_token'));
    await fetchUser()
    isLoggedIn.value = true
  }

  async function fetchUser() {
    console.log('fech');
    const res = await fetch('https://nuxt.meidanm.com/wp-json/wp/v2/users/me', {
      credentials: 'include', // crucial for cookie auth
      headers: {Authorization: `Bearer ${token.value}`}
    })
    userData.value = await res.json()
    console.log(userData.value);
    cart.state.user = userData.value
  }

  function logout() {
    token.value = null
    userData.value = null
    isLoggedIn.value = false
    if(process.env.CLIENT) {
      localStorage.removeItem('jwt_token')
    }
    cart.clear();
    cart.state.user = {};
  }




onMounted(() => {
  if (isLoggedIn.value) fetchUser()
})
</script>
