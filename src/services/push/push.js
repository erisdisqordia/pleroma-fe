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
  return navigator.serviceWorker.register('/static/sw.js')
    .then(function (registration) {
      console.log('Service worker successfully registered.')
      return registration
    })
    .catch(function (err) {
      console.error('Unable to register service worker.', err)
    })
}

function askPermission () {
  return new Promise(function (resolve, reject) {
    if (!window.Notification) return reject(new Error('Notifications disabled'))

    if (window.Notification.permission !== 'default') {
      return resolve(window.Notification.permission)
    }

    const permissionResult = window.Notification.requestPermission(function (result) {
      resolve(result)
    })

    if (permissionResult) permissionResult.then(resolve, reject)
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.')
    }
    return permissionResult
  })
}

function subscribe (registration, store) {
  if (!store.rootState.config.webPushNotifications) {
    return Promise.reject(new Error('Web Push is disabled in config'))
  }

  if (!store.rootState.instance.vapidPublicKey) {
    return Promise.reject(new Error('VAPID public key is not found'))
  }

  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(store.rootState.instance.vapidPublicKey)
  }
  return registration.pushManager.subscribe(subscribeOptions)
}

function sendSubscriptionToBackEnd (subscription, store) {
  return window.fetch('/api/v1/push/subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${store.rootState.oauth.token}`
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
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Bad status code from server.')
      }

      return response.json()
    })
    .then(function (responseData) {
      if (!responseData.id) {
        throw new Error('Bad response from server.')
      }
      return responseData
    })
}

export default function registerPushNotifications (store) {
  if (isPushSupported()) {
    registerServiceWorker()
      .then(function (registration) {
        return askPermission()
          .then(() => subscribe(registration, store))
          .then((subscription) => sendSubscriptionToBackEnd(subscription, store))
          .catch((e) => console.warn(`Failed to setup Web Push Notifications: ${e.message}`))
      })
  }
}
