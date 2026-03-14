// src/stores/user.js
import { reactive, computed } from 'vue'

export const userState = reactive({
  data: JSON.parse(localStorage.getItem('user_session')) || {},
})

export const isAdmin = computed(() => !!userState.data?.is_super_admin)
export const isLoggedIn = computed(() => !!userState.data?.id)

export function setUser(userData) {
  userState.data = userData || {}
  localStorage.setItem('user_session', JSON.stringify(userState.data))
}

export function clearUser() {
  userState.data = {}
  localStorage.removeItem('user_session')
}