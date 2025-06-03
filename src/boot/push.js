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
      applicationServerKey: 'BLDC7BhdZ5IEKTcBzhXz2jLkiaQvxpL8hjb-uVFIomYEArnRKhEvAIlDbHAiOgJwaj9IwHAJUD-p8POw0VCowYg'
    });

    console.log('📝 Push subscription object:', subscription);

    const res = await fetch('https://nuxt.meidanm.com/wp-json/pwa/v1/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    const result = await res.json();
    console.log('✅ Push subscription saved:', result);
  } catch (err) {
    console.error('❌ Push subscription failed:', err);
  }
}

if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
  subscribeToPushNotifications();
} else {
  console.warn('Push notifications are not supported in this browser.');
}

