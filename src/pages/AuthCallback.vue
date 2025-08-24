<template>
  <q-page class="q-pa-md flex flex-center">
    <q-spinner size="3em" color="primary" />
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Google sends code and state in query params
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state') || '/'

  if (!code) {
    router.replace('/') // fallback
    return
  }

  // Send code to your backend endpoint to exchange for token
  fetch('https://nuxt.meidanm.com/wp-json/custom/v1/google-login-redirect', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('jwt_token', data.token)
        // You might also update your cart.state.user here
        router.replace(state) // redirect to original page
      } else {
        console.error('Google redirect login failed', data)
        router.replace('/')
      }
    })
    .catch(err => {
      console.error('Redirect login error', err)
      router.replace('/')
    })
})
</script>
