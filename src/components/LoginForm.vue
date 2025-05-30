<template>
  <q-form @submit.prevent="login">
    <q-input v-model="username" label="Username or Email" outlined />
    <q-input v-model="password" type="password" label="Password" outlined />

    <q-btn label="Login" type="submit" color="primary" />
    <div v-if="error" class="text-negative q-mt-md">{{ error }}</div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import cart from 'src/stores/cart.js';

const username = ref('')
const password = ref('')
const error = ref('')
const emit = defineEmits(['login-success']);
const addedItems = ref('');
async function login() {
  try {

const res = await fetch('https://nuxt.meidanm.com/wp-json/jwt-auth/v1/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: username.value,
    password: password.value
  })
})

const data = await res.json();

if (data.token) {
  localStorage.setItem('jwt_token', data.token); // Store token
  emit('login-success', data.token);

  console.log('Login successful:', data);
} else {
  console.error('Login failed:', data.message);
}

const token = localStorage.getItem('jwt_token');

const userRes = await fetch('https://nuxt.meidanm.com/wp-json/wp/v2/users/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
const user = await userRes.json();
console.log(user);
const guestCart = await fetch('https://nuxt.meidanm.com/wp-json/wc/store/v1/cart', {
  credentials: 'include'
}).then(res => res.json())

// After login, get the user cart
const userCart = await fetch('https://nuxt.meidanm.com/wp-json/wc/store/v1/cart', {
  headers: {
    Authorization: `Bearer ${token}`
  },
  credentials: 'include'
}).then(res => res.json())
console.log(userCart);
// If user cart is empty and guest cart had items, sync
if (userCart.items_count === 0 && guestCart.items.length > 0) {
  for (const item of guestCart.items) {
    const itemRes = await fetch('https://nuxt.meidanm.com/wp-json/wc/store/v1/cart/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        id: item.id,
        quantity: item.quantity
      })
    })
    addedItems.value = await itemRes.json();
  }

    cart.state.items = addedItems.value.items || [];
    cart.state.items_count = addedItems.value.items_count || 0;
    cart.state.totals = addedItems.value.totals || {};
    cart.state.coupons = addedItems.value.coupons || [];
    cart.state.cart_array = addedItems.value || [];

  console.log('longer!!!');
}

  } catch (err) {
    error.value = 'Server error';
    console.log(err)
  }
}
</script>
