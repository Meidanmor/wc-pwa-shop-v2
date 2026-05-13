/* eslint-env serviceworker */

/*
 * This file (your custom service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { enable as enableNavigationPreload } from 'workbox-navigation-preload';

const API_BASE = '<%= VITE_API_BASE %>'

enableNavigationPreload();

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// ─── WooCommerce API: products & categories ───────────────────────────────────
registerRoute(
  ({ url }) =>
    url.origin === API_BASE &&
    (
      url.pathname === '/wp-json/wc/store/v1/products/categories' ||
      (url.pathname === '/wp-json/wc/store/v1/products' && url.searchParams.has('per_page'))
    ),
  new NetworkFirst({
    cacheName: 'woocommerce-api-v2.0',
    networkTimeoutSeconds: 1.5,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
);

registerRoute(
  ({ request }) => request.destination === 'image',

  new StaleWhileRevalidate({
    cacheName: 'product-images-v1',

    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
)

// ─── SEO API ──────────────────────────────────────────────────────────────────
registerRoute(
  ({ url }) =>
    url.origin === API_BASE &&
    url.pathname === '/wp-json/custom/v1/seo' &&
    url.searchParams.has('path'),
  new NetworkFirst({
    cacheName: 'seo-api-v2.0',
    networkTimeoutSeconds: 1.5,
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 })
    ]
  })
);

// ─── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', event => {
  console.log('[SW] Push received');
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error('Push data parse error', e);
  }

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

// ─── Navigation: SSR HTML pages ───────────────────────────────────────────────
//
// THE FIX:
//
// The old strategy cached the entire SSR HTML response (including the
// window.__CART_ARRAY__ that the server baked in). On the next refresh,
// if the network was slow or the 2s timeout elapsed, the SW served the
// stale cached HTML — meaning the user saw the old cart data even though
// the server had already computed the fresh one.
//
// The root cause: window.__CART_ARRAY__ is session-specific data. It
// changes on every request for every user. It must never be cached at
// the SW layer.
//
// Strategy: NetworkOnly for all navigation requests.
//   - The SW acts as a transparent pass-through for page loads.
//   - Navigation preload is still enabled so the network request fires
//     in parallel with SW startup — no extra latency vs. no SW at all.
//   - If the network is truly dead, the browser's own offline page shows
//     (acceptable — a stale cart is worse than an honest offline screen).
//
// If you want offline fallback for non-session pages (e.g. homepage
// when logged out), see the commented block below.
//
/*registerRoute(
  ({ request, url }) =>
    request.mode === 'navigate' &&
    !url.searchParams.has('preview'),

  new NetworkFirst({
    cacheName: 'ssr-pages-v1',

    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 // 1 day
      })
    ]
  })
)*/
// ─── Navigation: Offline-first SSR pages ─────────────────────────────

const PRECACHE_ROUTES = [
  '/',
  '/products/',
  '/cart/',
]

// Warm critical pages immediately after SW install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('ssr-pages-v1').then(async (cache) => {
      await cache.addAll(PRECACHE_ROUTES)
    })
  )
})

registerRoute(
  ({ request, url }) =>
    request.mode === 'navigate' &&
    !url.searchParams.has('preview'),

  async ({ event }) => {
    const requestUrl = new URL(event.request.url)

    try {
      // Network first
      const networkResponse = await fetch(event.request)

      // Cache successful navigations
      const cache = await caches.open('ssr-pages-v1')

      cache.put(event.request, networkResponse.clone())

      return networkResponse

    } catch (err) {
        console.log(err);
      // Exact cached page
      const cachedPage = await caches.match(event.request)

      if (cachedPage) {
        return cachedPage
      }

      // Fallback to app shell homepage
      const fallback = await caches.match('/')

      if (fallback) {
        // inject original path into header
        const headers = new Headers(fallback.headers)

        headers.set(
          'x-offline-fallback-route',
          requestUrl.pathname
        )

        const body = await fallback.text()

        return new Response(body, {
          status: 200,
          statusText: 'OK',
          headers
        })
      }

      return Response.error()
    }
  }
)
// ─── Optional: offline fallback for public pages only ─────────────────────────
//
// If you want SOME offline support for pages that don't contain session
// data, you can cache them selectively using a custom plugin that inspects
// the response body before storing it. But the safest rule is:
//
//   Any page whose HTML contains window.__CART_ARRAY__ (or any other
//   per-user injected state) must use NetworkOnly.
//
// If your SSR always injects __CART_ARRAY__ on every page (even as null),
// NetworkOnly for all navigation is the correct and simplest choice.
//
// If only certain routes inject it, you can scope NetworkOnly like this:
//
// registerRoute(
//   ({ request, url }) =>
//     request.mode === 'navigate' &&
//     SESSION_ROUTES.some(path => url.pathname.startsWith(path)),
//   new NetworkOnly()
// )
//
// registerRoute(
//   ({ request, url }) =>
//     request.mode === 'navigate' &&
//     !SESSION_ROUTES.some(path => url.pathname.startsWith(path)),
//   new NetworkFirst({
//     cacheName: 'ssr-public-pages',
//     networkTimeoutSeconds: 3,
//     plugins: [
//       new ExpirationPlugin({
//         maxEntries: 20,
//         maxAgeSeconds: 60 * 5   // 5 minutes max — public pages change too
//       })
//     ]
//   })
// )