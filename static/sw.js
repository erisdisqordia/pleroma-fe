/* eslint-env serviceworker */

function getWindowClients () {
  return clients.matchAll({ includeUncontrolled: true })
    .then((clientList) => clientList.filter(({ type }) => type === 'window'))
}

self.addEventListener('push', (event) => {
  if (event.data) {
    event.waitUntil(getWindowClients().then((list) => {
      const data = event.data.json()

      if (list.length === 0) return self.registration.showNotification(data.title, data)
    }))
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(getWindowClients().then((list) => {
    for (var i = 0; i < list.length; i++) {
      var client = list[i]
      if (client.url === '/' && 'focus' in client) { return client.focus() }
    }

    if (clients.openWindow) return clients.openWindow('/')
  }))
})
