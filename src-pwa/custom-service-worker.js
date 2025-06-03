/* eslint-env serviceworker */

/*
 * This file (your custom service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

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
/*registerRoute(
  ({ url }) => url.origin === 'https://nuxt.meidanm.com' && url.pathname.startsWith('/wp-json/wc/store/v1/products?per_page='),
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

self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-128x128.png',
    badge: '/icons/icon-128x128.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ✅ Navigation fallback for SPA routing
if (process.env.MODE !== 'ssr' || process.env.PROD) {
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
}

