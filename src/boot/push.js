import { Platform } from 'quasar'

let PushNotifications

function generateUUID() {
  // https://stackoverflow.com/a/2117523/1218980
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
/**
 * Convert VAPID base64 key to UInt8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Replace this with your own VAPID public key
const APP_SERVER_KEY = 'BHSV149RpWY5IkRyGC_DvxRWQuO_29FAdwhhFu9IPyfUNHDedg7pTCer_WrlJipDvmU0JqxBy4lKHWItX2E6cLw'

/**
 * Get or create a unique device ID (stored in localStorage)
 */
function getDeviceId() {
  let deviceId = localStorage.getItem('pwa_device_id')
  if (!deviceId) {
    deviceId = generateUUID()
    localStorage.setItem('pwa_device_id', deviceId)
  }
  return deviceId
}

/**
 * Subscribe to push notifications (Web/PWA)
 */
export async function subscribeToWebPush() {
  console.log('🚀 Push setup started (Web)')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('🔴 Notification permission not granted.')
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(APP_SERVER_KEY)
    })

    const deviceId = getDeviceId()
    const cartToken = localStorage.getItem('wc_cart_token') || null

    const payload = {
      device_id: deviceId,
      cart_token: cartToken,
      subscription: subscription
    }

    const res = await fetch('https://nuxt.meidanm.com/wp-json/pwa/v1/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await res.json()
    console.log('✅ Push subscription saved:', result)
  } catch (err) {
    console.error('❌ Push subscription failed:', err)
  }
}

/**
 * Register native push notifications (Capacitor)
 */
async function registerNativePush() {
  if (!PushNotifications) return

  let permStatus = await PushNotifications.checkPermissions()
  if (permStatus.receive !== 'granted') {
    permStatus = await PushNotifications.requestPermissions()
  }

  if (permStatus.receive === 'granted') {
    await PushNotifications.register()
  }

  PushNotifications.addListener('registration', (token) => {
    console.log('📡 Native push token:', token.value)
    // Send to backend if needed
  })

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('🔔 Notification received:', notification)
  })
}

/**
 * Sync cart token + timestamp when user leaves or hides the app
 */
async function syncCartTimestamp() {
  try {
    const cartToken = localStorage.getItem('wc_cart_token')
    if (!cartToken) return

    await fetch('https://nuxt.meidanm.com/wp-json/pwa/v1/cart-timestamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart_token: cartToken,
        timestamp: Date.now()
      })
    })

    console.log('🕒 Cart timestamp synced:', cartToken)
  } catch (err) {
    console.error('❌ Failed to sync cart timestamp:', err)
  }
}

function setupCartTracking() {
  window.addEventListener('beforeunload', syncCartTimestamp)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) syncCartTimestamp()
  })
}

/**
 * Init push + cart tracking
 */
export default async () => {
  if (typeof window === 'undefined') return

  setupCartTracking()

  if (Platform.is && Platform.is.capacitor) {
    try {
      PushNotifications = require('@capacitor/push-notifications').PushNotifications
      await registerNativePush()
    } catch (e) {
      console.warn('Push plugin not available:', e)
    }
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.action === 'navigate' && event.data.url) {
        if (window.$router) {
          window.$router.push(event.data.url).catch(() => {})
        } else {
          window.location.href = event.data.url
        }
      }
    })
  }
}
