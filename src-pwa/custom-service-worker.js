/* eslint-env serviceworker */

/*
 * This file (your custom service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, /*createHandlerBoundToURL*/ } from 'workbox-precaching'
import { registerRoute, /*NavigationRoute*/ } from 'workbox-routing'

// ✅ IMPORT THESE
import { NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Setup service worker behavior
self.skipWaiting()
clientsClaim()

// Pre-cache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Clean old caches
cleanupOutdatedCaches()

// ✅ API caching for WooCommerce backend
registerRoute(
  ({ url }) =>
      url.origin === 'https://nuxt.meidanm.com' &&
    url.pathname === ('/wp-json/wc/store/v1/products' || '/wp-json/wc/store/v1/products/categories') &&
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
)
registerRoute(
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
)

self.addEventListener('install', (/*event*/) => {
  console.log('🛠️ Service Worker installing');
  self.skipWaiting(); // Optional but useful
});

self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker activating');
  event.waitUntil(self.clients.claim()); // Optional
});

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  const data = event.data.json();
  console.log('[Service Worker] Push Data:', data);

  const options = {
    body: data.body,
    icon: '/icons/icon-128x128.png',
    badge: '/icons/icon-128x128.png',
    data: data.data, // <-- ✅ This is critical
    tag: 'order-confirmation', // optional: prevents duplicates
    renotify: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
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
/*if (process.env.MODE !== 'ssr' || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
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

