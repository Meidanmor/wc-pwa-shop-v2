/* eslint-env serviceworker */

/*
 * This file (your custom service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches/*, createHandlerBoundToURL*/} from 'workbox-precaching'
import { registerRoute/*, NavigationRoute*/ } from 'workbox-routing'

// ✅ IMPORT THESE
import { NetworkFirst/*, StaleWhileRevalidate*/ } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { enable as enableNavigationPreload } from 'workbox-navigation-preload';

// Call it directly
enableNavigationPreload();

// Setup service worker behavior
self.skipWaiting()
clientsClaim()

// Pre-cache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Clean old caches
cleanupOutdatedCaches()

// ✅ API caching for WooCommerce backend
/*registerRoute(
  ({ url }) =>
      url.origin === 'https://nuxt.meidanm.com' &&
      (url.pathname === '/wp-json/wc/store/v1/products' || url.pathname === '/wp-json/wc/store/v1/products/categories') &&
    url.searchParams.has('per_page'),
  new NetworkFirst({
    cacheName: 'woocommerce-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
)*/
/*registerRoute(
  ({ url }) =>
    url.origin === 'https://nuxt.meidanm.com' &&
      (
          (
              url.pathname === '/wp-json/wc/store/v1/products/categories'
          ) ||
          (
              url.pathname === '/wp-json/wc/store/v1/products'
           &&
              url.searchParams.has('per_page')
          )
      ),
  new StaleWhileRevalidate({
    cacheName: 'woocommerce-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);*/
registerRoute(
  ({ url }) =>
    url.origin === 'https://nuxt.meidanm.com' &&
      (
          (url.pathname === '/wp-json/wc/store/v1/products/categories') ||
          (url.pathname === '/wp-json/wc/store/v1/products' && url.searchParams.has('per_page'))
      ),
  new NetworkFirst({
    cacheName: 'woocommerce-api-v2', // Changed name to clear old "stale" cache
    networkTimeoutSeconds: 1.5,      // Fast fallback for real users
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
);

/*registerRoute(
  ({ url }) =>
      url.origin === 'https://nuxt.meidanm.com' &&
    url.pathname === '/wp-json/custom/v1/seo' &&
    url.searchParams.has('path'),
  new NetworkFirst({
    cacheName: 'seo-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
)*/
/*registerRoute(
  ({ url }) =>
    url.origin === 'https://nuxt.meidanm.com' &&
    url.pathname === '/wp-json/custom/v1/seo' &&
    url.searchParams.has('path'),
  new StaleWhileRevalidate({
    cacheName: 'seo-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);*/
registerRoute(
  ({ url }) =>
    url.origin === 'https://nuxt.meidanm.com' &&
    url.pathname === '/wp-json/custom/v1/seo' &&
    url.searchParams.has('path'),
  new NetworkFirst({
    cacheName: 'seo-api-v2', // Versioned to clear old data
    networkTimeoutSeconds: 1.5,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
);
self.addEventListener('install', (/*event*/) => {
  console.log('🛠️ Service Worker installing');
  self.skipWaiting(); // Optional but useful
});

self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker activating & cleaning old caches...');

  // List the cache names you want to KEEP.
  // If you changed your cacheNames to 'woocommerce-api-v2', put that here.
  const cacheAllowlist = ['woocommerce-api-v2', 'seo-api-v2', 'ssr-pages'];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // If the cache found isn't in our 'allow' list, and it's one of ours, delete it
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients so the new SW takes over immediately
      return self.clients.claim();
    })
  );
});

self.addEventListener('push', event => {
  console.log('[SW] Push received');
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Push data parse error', e);
  }

  // Support both direct and wrapped payloads
  const notification = data.notification || data;

  const options = {
      body: notification.body,
      icon: notification.icon || '/icons/favicon-128x128.png',
      badge: notification.badge || '/icons/favicon-96x96.png',
      data: notification.data || {},
      tag: notification.tag || 'default',
      requireInteraction: notification.requireInteraction || true,
      renotify: notification.renotify || true,
      vibrate: notification.vibrate || ''
  };

  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const clickUrl = event.notification?.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          client.postMessage({ action: 'navigate', url: clickUrl });
          return client.focus();
        }
      }

      return clients.openWindow(clickUrl);
    })
  );
});


// ✅ Navigation fallback for SPA routing
// This tells the SW: "Try to get the live SSR page first so we see
// the products and SEO immediately. If the network fails, use the cache."
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'ssr-pages',
    networkTimeoutSeconds: 2, // If network is dead, fallback to cache after 2s
    plugins: [
      new ExpirationPlugin({ maxEntries: 10 })
    ]
  })
)
/*if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      //createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      {
        denylist: [
          new RegExp(process.env.PWA_SERVICE_WORKER_REGEX),
          /workbox-(.)*\.js$/
        ]
      }
    )
  )
}*/

