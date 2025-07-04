// src/composables/useApiFetch.js
export async function fetchWithToken(url, options = {}) {
  if (process.env.CLIENT) {
    const token = localStorage.getItem('jwt_token') // or use Vue state if stored globally

    const headers = {
      'Content-Type': 'application/json',
      ...(token && token != null ? {Authorization: `Bearer ${token}`} : {})
    }

    return fetch(url, {
      credentials: 'include', // Always include for WooCommerce Store API
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {})
      }
    })
  }
}
