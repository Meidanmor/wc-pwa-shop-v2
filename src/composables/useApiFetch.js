export async function fetchWithToken(url, options = {}) {
  if (process.env.CLIENT) {
    // client-side: include JWT if exists
    const token = localStorage.getItem('jwt_token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    return fetch(url, {
      credentials: 'include',
      ...options,
      headers: { ...headers, ...(options.headers || {}) }
    })
  } else {
    // SSR: directly fetch the API
    return fetch(url, { ...options })
  }
}
