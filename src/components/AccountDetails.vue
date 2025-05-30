<template>
  <div>
    <h2 class="text-h4">Account Details</h2>
    <div v-if="account.user_email">
    <q-form @submit.prevent="updateDetails">
      <q-input v-model="account.first__name" label="First Name" />
      <q-input v-model="account.last__name" label="Last Name" />
      <q-input disable readonly v-model="account.user_email" label="Email" type="email" />
      <q-btn type="submit" label="Save Changes" color="primary" />
    </q-form>
    </div>
    <div v-else> <q-spinner color="primary" size="2em" /> </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const account = ref({
  first_name: '',
  last_name: '',
  email: ''
})

const token = localStorage.getItem('jwt_token');

onMounted(async () => {
  const res = await fetch('https://nuxt.meidanm.com/wp-json/wp/v2/users/me', {
    credentials: 'include',
    headers: {
    Authorization: `Bearer ${token}`
  }
  })
    account.value = await res.json()
  console.log(account.value)
})

async function updateDetails() {
console.log(account.value);
console.log(JSON.stringify(account.value).replace('__name', '_name'));
  await fetch('https://nuxt.meidanm.com/wp-json/wp/v2/users/me', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(account.value).replaceAll('__name', '_name')
  })
  .then(res => console.log(res))
}
</script>
