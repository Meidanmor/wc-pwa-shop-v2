// src/composables/useApiFetch.js
function isValidJwt(token) {
  return typeof token === 'string'
    && token.trim() !== ''
    && token !== 'null'
    && token !== 'undefined'
    && token.split('.').length === 3
}
export async function fetchWithToken(url, options = {}) {
  if (process.env.CLIENT) {
    const token = localStorage.getItem('jwt_token') // or use Vue state if stored globally


    console.log(token);
    const headers = {
      'Content-Type': 'application/json',
      ...(isValidJwt(token) ? {Authorization: `Bearer ${token}`} : {})
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
