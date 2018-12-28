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

function getOrCreateServiceWorker () {
  return runtime.register()
    .catch((err) => console.error('Unable to get or create a service worker.', err))
}

function subscribePush (registration, isEnabled, vapidPublicKey) {
  if (!isEnabled) return Promise.reject(new Error('Web Push is disabled in config'))
  if (!vapidPublicKey) return Promise.reject(new Error('VAPID public key is not found'))

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  }
  return registration.pushManager.subscribe(subscribeOptions)
}

function unsubscribePush (registration) {
  return registration.pushManager.getSubscription()
    .then((subscribtion) => {
      if (subscribtion === null) { return }
      return subscribtion.unsubscribe()
    })
}

function deleteSubscriptionFromBackEnd (token) {
  return window.fetch('/api/v1/push/subscription/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    if (!response.ok) throw new Error('Bad status code from server.')
    return response
  })
}

function sendSubscriptionToBackEnd (subscription, token, notificationVisibility) {
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
          follow: notificationVisibility.follows,
          favourite: notificationVisibility.likes,
          mention: notificationVisibility.mentions,
          reblog: notificationVisibility.repeats
        }
      }
    })
  }).then((response) => {
    if (!response.ok) throw new Error('Bad status code from server.')
    return response.json()
  }).then((responseData) => {
    if (!responseData.id) throw new Error('Bad response from server.')
    return responseData
  })
}

export function registerPushNotifications (isEnabled, vapidPublicKey, token, notificationVisibility) {
  if (isPushSupported()) {
    getOrCreateServiceWorker()
      .then((registration) => subscribePush(registration, isEnabled, vapidPublicKey))
      .then((subscription) => sendSubscriptionToBackEnd(subscription, token, notificationVisibility))
      .catch((e) => console.warn(`Failed to setup Web Push Notifications: ${e.message}`))
  }
}

export function unregisterPushNotifications (token) {
  if (isPushSupported()) {
    Promise.all([
      deleteSubscriptionFromBackEnd(token),
      getOrCreateServiceWorker()
        .then((registration) => {
          return unsubscribePush(registration).then((result) => [registration, result])
        })
        .then(([registration, unsubResult]) => {
          if (!unsubResult) {
            console.warn('Push subscription cancellation wasn\'t successful, killing SW anyway...')
          }
          return registration.unregister().then((result) => {
            if (!result) {
              console.warn('Failed to kill SW')
            }
          })
        })
    ]).catch((e) => console.warn(`Failed to disable Web Push Notifications: ${e.message}`))
  }
}
