const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'product/:slug', component: () => import('pages/ProductPage.vue') },
      { path: 'cart', component: () => import('pages/CartPage.vue') },
      { path: 'checkout',component: () => import('pages/CheckoutPage.vue')},
      { path: 'products', name: 'products', component: () => import('pages/ProductsPage.vue') },
      { path: 'thank-you', name: 'thank-you', component: () => import('pages/ThankYouPage.vue') },
      { path: 'my-account', name: 'my-account', component: () => import('pages/AccountPage.vue') },
        {
  path: '/auth/callback',
  component: () => import('pages/AuthCallback.vue'),
  meta: { public: true } // optional, if you have auth guards
}

    ]
  },

  {
  path: '/admin',
  component: () => import('layouts/AdminLayout.vue'),
  meta: { requiresAdmin: true },
  children: [
    { path: '', component: () => import('pages/Admin/DashboardPage.vue') },
    { path: 'products', component: () => import('pages/Admin/ProductsPage.vue') },
    { path: 'products/:id', component: () => import('pages/Admin/ProductDetailPage.vue'), props: true }
    // Orders and statistics will be added later
  ]
},
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
