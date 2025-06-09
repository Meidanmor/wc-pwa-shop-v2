// src/composables/useApiFetch.js
export async function fetchWithToken(url, options = {}) {
  if (process.env.CLIENT) {
    const token = localStorage.getItem('jwt_token') // or use Vue state if stored globally

    const isValidToken = token && typeof token === 'string' && token.trim().split('.').length === 3;

    const headers = {
      'Content-Type': 'application/json',
      ...(isValidToken ? {Authorization: `Bearer ${token}`} : {})
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
