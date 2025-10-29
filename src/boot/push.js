function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Replace this with your own VAPID public key
const APP_SERVER_KEY = 'BLDC7BhdZ5IEKTcBzhXz2jLkiaQvxpL8hjb-uVFIomYEArnRKhEvAIlDbHAiOgJwaj9IwHAJUD-p8POw0VCowYg';

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications() {
  console.log('🚀 Push setup started');

  const permission = await Notification.requestPermission();
  console.log('🟢 Permission result:', permission);

  if (permission !== 'granted') {
    console.warn('🔴 Notification permission not granted.');
    return;
  }

  try {
    console.log('🔄 Waiting for service worker');
    const registration = await navigator.serviceWorker.ready;

    console.log('🟢 Service worker ready:', registration);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(APP_SERVER_KEY),
    });

    console.log('📝 Push subscription object:', subscription);

    const res = await fetch('https://nuxt.meidanm.com/wp-json/pwa/v1/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    const result = await res.json();
    console.log('✅ Push subscription saved:', result);
  } catch (err) {
    console.error('❌ Push subscription failed:', err);
  }
}

/**
 * Sync cart token + timestamp when user leaves or hides the app
 */
async function syncCartTimestamp() {
  try {
    // Retrieve your cart token (saved when fetching WooCommerce Store API cart)
    const cartToken = localStorage.getItem('wc_cart_token');
    if (!cartToken) return;

    await fetch('https://nuxt.meidanm.com/wp-json/pwa/v1/cart-timestamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_token: cartToken,
        timestamp: Date.now(),
      }),
    });

    console.log('🕒 Cart timestamp synced:', cartToken);
  } catch (err) {
    console.error('❌ Failed to sync cart timestamp:', err);
  }
}

/**
 * Attach listeners for when user leaves or hides the app
 */
function setupCartTracking() {
  window.addEventListener('beforeunload', syncCartTimestamp);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      syncCartTimestamp();
    }
  });
}

// 🚦 Handle push navigation from SW
if (process.env.CLIENT) {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.action === 'navigate' && event.data.url) {
        const targetUrl = event.data.url;

        if (window.$router) {
          window.$router.push(targetUrl).catch(() => {
          });
        } else {
          window.location.href = targetUrl;
        }
      }
    });

    // Initialize on app start
    setupCartTracking();

    // Optional: auto-subscribe to push (or call manually elsewhere)
    // subscribeToPushNotifications();
  }
}
