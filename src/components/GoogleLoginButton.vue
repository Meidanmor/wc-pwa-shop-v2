<template>
  <q-btn
    label="Sign in with Google"
    icon="login"
    color="primary"
    :loading="loading"
    @click="handleLogin"
  />
</template>

<script setup>
import { ref } from 'vue';
import cart from 'src/stores/cart.js';

const GOOGLE_CLIENT_ID = '484223740755-cjhfcl0as9hmo0a1866o596m6r7ed8sa.apps.googleusercontent.com'; // Replace with actual client ID

const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await loadGoogleSdk();

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.prompt(); // Shows native popup
  } catch (err) {
    console.error('Failed to load Google SDK:', err);
  } finally {
    loading.value = false;
  }
}

function handleCredentialResponse(response) {
  const idToken = response.credential;

  fetch('https://nuxt.meidanm.com/wp-json/custom/v1/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: idToken }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log('Login successful:', data.user);
        if (data.token) {
          localStorage.setItem('jwt_token', data.token); // Store token
          console.log(localStorage.getItem('jwt_token'));
        }
        if (data.user) {
          cart.state.user = data.user;
          console.log(cart.state.user)
        }
        // TODO: store user in cart state or Vue global state
      } else {
        console.error('Login failed:', data.message);
      }
    })
    .catch(error => {
      console.error('Login request failed:', error);
    });
}

// Dynamically load the Google Identity Services SDK
function loadGoogleSdk() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      return resolve();
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  });
}
</script>

