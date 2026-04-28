<template>
  <transition name="fade">
    <div v-if="visible" class="cookie-banner">
      <div class="cookie-text">
        We use cookies to improve your experience on our website.
      </div>

      <div class="cookie-actions">
        <q-btn
          flat
          no-caps
          label="Privacy Policy"
          to="/privacy-policy"
          color="secondary"
        />

        <q-btn
          unelevated
          no-caps
          color="secondary"
          label="Accept"
          @click="acceptCookies"
        />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  const accepted = localStorage.getItem('cookie_consent')
  if (!accepted) visible.value = true
})

function acceptCookies() {
  localStorage.setItem('cookie_consent', 'accepted')
  visible.value = false
}
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  z-index: 9999;
  background: white;
  color: #111;
  border-radius: 18px;
  padding: 40px 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,.12);
  display: flex;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.cookie-text {
  flex: 1;
  min-width: 220px;
  font-size: 14px;
  line-height: 1.4;
}

.cookie-actions {
  display: flex;
  gap: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .cookie-actions {
    width: 100%;
  }

  .cookie-actions .q-btn {
    flex: 1;
  }
}
</style>