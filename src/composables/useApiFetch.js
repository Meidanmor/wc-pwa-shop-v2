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
    console.warn('Token expired or unauthorized. Clearing session...');

    // Dynamically import to avoid circular dependency crashes
    const { clearUser } = await import('src/stores/user');
    clearUser();

    // Optional: Redirect to login or reload to reset app state
    window.location.href = '/login?reason=expired';
  }

  return response;
}