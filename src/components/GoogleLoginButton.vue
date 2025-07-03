<template>
  <q-btn
    color="primary"
    label="Sign in with Google"
    @click="handleLogin"
    icon="login"
  />
</template>

<script setup>
import { onMounted } from 'vue';

const GOOGLE_CLIENT_ID = '484223740755-cjhfcl0as9hmo0a1866o596m6r7ed8sa.apps.googleusercontent.com'; // Replace with actual client ID

function handleLogin() {
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });

  google.accounts.id.prompt(); // opens native popup
}

function handleCredentialResponse(response) {
  const idToken = response.credential;

  // Send token to your WordPress backend for validation & login
  fetch('https://nuxt.meidanm.com/wp-json/your-namespace/google-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: idToken }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // store auth cookie or user info in cart state
        console.log('Login successful:', data.user);
      } else {
        console.error('Login failed:', data.message);
      }
    });
}
</script>
