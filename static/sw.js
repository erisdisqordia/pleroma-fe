/* eslint-env serviceworker */
self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()

    const promiseChain = clients.matchAll({
      includeUncontrolled: true
    }).then(function (clientList) {
      const list = clientList.filter((item) => item.type === 'window')
      if (list.length) return
      return self.registration.showNotification(data.title, data)
    })

    event.waitUntil(promiseChain)
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  event.waitUntil(clients.matchAll({
    includeUncontrolled: true
  }).then(function (clientList) {
    const list = clientList.filter((item) => item.type === 'window')

    for (var i = 0; i < list.length; i++) {
      var client = list[i]
      if (client.url === '/' && 'focus' in client) { return client.focus() }
    }
    if (clients.openWindow) { return clients.openWindow('/') }
  }))
})
