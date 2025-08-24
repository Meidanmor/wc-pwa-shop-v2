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
import { ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import cart from "src/stores/cart.js";

// 🔒 Use environment variable in production
const GOOGLE_CLIENT_ID =
  "484223740755-cjhfcl0as9hmo0a1866o596m6r7ed8sa.apps.googleusercontent.com";

const loading = ref(false);
const router = useRouter();
const route = useRoute();

let loginInProgress = false;

function handleLogin() {
  if (loginInProgress) return;
  loginInProgress = true;
  loading.value = true; // show spinner immediately

  try {
    // Initialize Google Identity Services
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Prompt with notification callback
    window.google.accounts.id.prompt((notification) => {
      if (
        notification.isNotDisplayed() ||
        notification.isSkippedMoment() ||
        notification.isDismissedMoment()
      ) {
        console.warn(
          "Google popup blocked, dismissed, or skipped – using redirect fallback"
        );
        loginInProgress = false;
        loading.value = false;

        // Redirect fallback
        redirectToGoogleLogin();
      }
    });
  } catch (err) {
    console.error("Google login failed:", err);
    loginInProgress = false;
    loading.value = false;

    // Optional: fallback
    redirectToGoogleLogin();
  }
}

function handleCredentialResponse(response) {
  loading.value = true; // spinner
  const idToken = response.credential;

  fetch("https://nuxt.meidanm.com/wp-json/custom/v1/google-login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  })
    .then((res) => res.json())
    .then(async (data) => {
      if (data.success) {
        if (data.token) localStorage.setItem("jwt_token", data.token);
        if (data.user) cart.state.user = data.user;

        // 🔄 Force route refresh
        await nextTick();
        router.replace({
          path: route.path,
          query: { ...route.query, t: Date.now() },
        });
      } else {
        console.error("Login failed:", data.message);
      }
    })
    .catch((error) => {
      console.error("Login request failed:", error);
    })
    .finally(() => {
      loginInProgress = false;
      loading.value = false;
    });
}

// Redirect fallback to Google OAuth
function redirectToGoogleLogin() {
  const redirectUri = 'https://wc-pwa-shop-v2.onrender.com/auth/callback'; // must match Google app redirect URI
  const state = encodeURIComponent(window.location.href); // save current page

  const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
              `client_id=${GOOGLE_CLIENT_ID}` +
              `&redirect_uri=${encodeURIComponent(redirectUri)}` +
              `&response_type=code` +
              `&scope=openid%20email%20profile` +
              `&state=${state}` +
              `&prompt=select_account`; // optional: forces account selection

  window.location.href = url;
}

</script>
