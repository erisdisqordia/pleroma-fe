import runtime from 'serviceworker-webpack-plugin/lib/runtime'

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

function isPushSupported () {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

function registerServiceWorker () {
  return runtime.register()
    .catch((err) => console.error('Unable to register service worker.', err))
}

function askPermission () {
  return new Promise((resolve, reject) => {
    const Notification = window.Notification

    if (!Notification) return reject(new Error('Notifications disabled'))
    if (Notification.permission !== 'default') return resolve(Notification.permission)

    const permissionResult = Notification.requestPermission(resolve)

    if (permissionResult) permissionResult.then(resolve, reject)
  }).then((permissionResult) => {
    if (permissionResult !== 'granted') throw new Error('We weren\'t granted permission.')
    return permissionResult
  })
}

function subscribe (registration, isEnabled, vapidPublicKey) {
  if (!isEnabled) return Promise.reject(new Error('Web Push is disabled in config'))
  if (!vapidPublicKey) return Promise.reject(new Error('VAPID public key is not found'))

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  }
  return registration.pushManager.subscribe(subscribeOptions)
}

function sendSubscriptionToBackEnd (subscription, token) {
  return window.fetch('/api/v1/push/subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      subscription,
      data: {
        alerts: {
          follow: true,
          favourite: true,
          mention: true,
          reblog: true
        }
      }
    })
  })
    .then((response) => {
      if (!response.ok) throw new Error('Bad status code from server.')
      return response.json()
    })
    .then((responseData) => {
      if (!responseData.id) throw new Error('Bad response from server.')
      return responseData
    })
}

export default function registerPushNotifications (isEnabled, vapidPublicKey, token) {
  if (isPushSupported()) {
    registerServiceWorker()
      .then((registration) => {
        return askPermission()
          .then(() => subscribe(registration, isEnabled, vapidPublicKey))
          .then((subscription) => sendSubscriptionToBackEnd(subscription, token))
          .catch((e) => console.warn(`Failed to setup Web Push Notifications: ${e.message}`))
      })
  }
}
