export async function subscribeToPushNotifications() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'BLDC7BhdZ5IEKTcBzhXz2jLkiaQvxpL8hjb-uVFIomYEArnRKhEvAIlDbHAiOgJwaj9IwHAJUD-p8POw0VCowYg'
  });

  await fetch('https://yourdomain.com/wp-json/pwa/v1/save-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
}