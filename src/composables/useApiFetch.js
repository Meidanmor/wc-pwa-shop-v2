export async function fetchWithToken(url, options = {}) {
  if (process.env.CLIENT) {
    const token = localStorage.getItem('jwt_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    return fetch(url, {
      credentials: 'include',
      ...options,
      headers: { ...headers, ...(options.headers || {}) }
    });
  } else {
    // SSR: return a dummy resolved response so client code won’t crash
    return {
      ok: false,
      json: async () => null,
      status: 0
    };
  }
}