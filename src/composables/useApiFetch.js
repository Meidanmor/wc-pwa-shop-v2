export async function fetchWithToken(url, options = {}) {
  const isClient = typeof window !== 'undefined';

  // 1. Prepare Headers
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (isClient) {
    const token = localStorage.getItem('jwt_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // 2. Perform the Fetch
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers
  });

  // 3. Handle Expired Token (Interception)
  if (response.status === 401 && isClient) {
// 🟢 CRITICAL CHECK:
    // Is this a data fetch or a JS/CSS file?
    // We ONLY redirect if it's a data request (usually starts with http or /wp-json)
    const isDataRequest = url.includes('wp-json') || !url.match(/\.(js|css|woff2?|png|jpg)$/);

    if (isDataRequest && !window.location.pathname.includes('/login')) {
      console.warn('Token expired. Clearing session...');

      // We still use dynamic import to be safe with Quasar's boot order
      const {clearUser} = await import('src/stores/user');
      clearUser();

      window.location.href = '/login?reason=expired';
    }
  }

  return response;
}