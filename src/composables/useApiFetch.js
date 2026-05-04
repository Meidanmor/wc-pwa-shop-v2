let authExpiredTriggered = false

export async function fetchWithToken(url, options = {}) {
  const isClient = typeof window !== 'undefined'

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  // ✅ Only attach token on client
  if (isClient) {
    const token = localStorage.getItem('jwt_token')
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let response

  try {
    response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers
    })
  } catch (err) {
    console.error('[fetchWithToken] FETCH FAILED:', url, err)
    throw err // ✅ important for SSR debugging
  }

  // ✅ Handle auth only on client
  if ((response.status === 401 || response.status === 403) && isClient) {
    console.log(await response.text())

    const isDataRequest =
      url.includes('wp-json') ||
      !url.match(/\.(js|css|woff2?|png|jpg)$/)

    if (isDataRequest && !authExpiredTriggered) {
      authExpiredTriggered = true

      const { clearUser } = await import('src/stores/user')
      clearUser()

      window.dispatchEvent(new CustomEvent('auth-expired'))
    }
  }

  // ✅ VERY IMPORTANT: guard localStorage
  if (isClient) {
    const latestCartToken = response.headers.get('Cart-Token')

    if (
      latestCartToken &&
      latestCartToken !== localStorage.getItem('wc_cart_token')
    ) {
      localStorage.setItem('wc_cart_token', latestCartToken)
    } else {
      console.log('new token is not updated')
    }
  }

  return response
}