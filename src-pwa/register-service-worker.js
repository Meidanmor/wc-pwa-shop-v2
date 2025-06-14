import { register } from 'register-service-worker'
import { useRouter } from 'vue-router';

const router = useRouter();

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready ( registration ) {
     console.log('Service worker is active.', registration)
  },

  registered ( registration ) {
    console.log('Service worker has been registered.', registration)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data?.action === 'navigate' && event.data.url) {
          console.log('[Client] Navigating to:', event.data.url);
          router.push(event.data.url);
        }
      });
    }
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

  error ( err ) {
     console.error('Error during service worker registration:', err)
  }
})
//navigator.serviceWorker.register('/custom-service-worker.js') // or custom name if you changed swDest
