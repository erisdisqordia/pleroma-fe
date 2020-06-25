/* eslint-env serviceworker */

import localForage from 'localforage'
import { parseNotification } from './services/entity_normalizer/entity_normalizer.service.js'
import { prepareNotificationObject } from './services/notification_utils/notification_utils.js'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './i18n/service_worker_messages.js'

Vue.use(VueI18n)
const i18n = new VueI18n({
  // By default, use the browser locale, we will update it if neccessary
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

function isEnabled () {
  return localForage.getItem('vuex-lz')
    .then(data => data.config.webPushNotifications)
}

function getWindowClients () {
  return clients.matchAll({ includeUncontrolled: true })
    .then((clientList) => clientList.filter(({ type }) => type === 'window'))
}

const setLocale = async () => {
  const state = await localForage.getItem('vuex-lz')
  const locale = state.config.interfaceLanguage || 'en'
  i18n.locale = locale
}

const maybeShowNotification = async (event) => {
  const enabled = await isEnabled()
  const activeClients = await getWindowClients()
  await setLocale()
  if (enabled && (activeClients.length === 0)) {
    const data = event.data.json()

    const url = `${self.registration.scope}api/v1/notifications/${data.notification_id}`
    const notification = await fetch(url, { headers: { Authorization: 'Bearer ' + data.access_token } })
    const notificationJson = await notification.json()
    const parsedNotification = parseNotification(notificationJson)

    const res = prepareNotificationObject(parsedNotification, i18n)

    self.registration.showNotification(res.title, res)
  }
}

self.addEventListener('push', async (event) => {
  if (event.data) {
    event.waitUntil(maybeShowNotification(event))
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
