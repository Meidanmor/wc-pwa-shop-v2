let authExpiredTriggered = false
let wasLoggedIn = false

export function setLoggedIn(value) {
  wasLoggedIn = value
  if (!value) authExpiredTriggered = false // reset on logout
}

export async function fetchWithToken(url, options = {}) {
  const isClient = typeof window !== 'undefined'

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if ((response.status === 401 || response.status === 403) && isClient) {
    const isDataRequest =
      url.includes('wp-json') ||
      !url.match(/\.(js|css|woff2?|png|jpg)$/)

    if (isDataRequest && wasLoggedIn && !authExpiredTriggered) {
      authExpiredTriggered = true
      window.dispatchEvent(new CustomEvent('auth-expired'))
    }
  }

  return response
}