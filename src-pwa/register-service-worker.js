import { register } from 'register-service-worker'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered (/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    // console.log('New content is downloading.')
  },

  updated (/* registration */) {
    // console.log('New content is available; please refresh.')
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
register('/custom-service-worker.js', {
  type: 'module', // 👈 Important

  ready (registration) {
    console.log('✅ Service worker is active:', registration)
  },
  registered (registration) {
    console.log('📦 Service worker registered:', registration)
  },
  cached () {
    console.log('💾 Content cached')
  },
  updatefound () {
    console.log('⬇️ New content is downloading...')
  },
  updated () {
    console.log('🔄 New content available!')
  },
  offline () {
    console.log('📴 App running in offline mode')
  },
  error (err) {
    console.error('❌ Service worker registration failed:', err)
  }
})

navigator.serviceWorker.register('/service-worker.js')
  .then(reg => {
    console.log('✅ SW registered:', reg);
    return navigator.serviceWorker.ready;
  })
  .then(ready => {
    console.log('🟢 SW ready:', ready);
  })
  .catch(err => {
    console.error('❌ SW error:', err);
  });
