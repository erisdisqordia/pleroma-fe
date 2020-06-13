/* eslint-env serviceworker */
/* eslint-disable import/no-webpack-loader-syntax */

import localForage from 'localforage'
import { parseNotification } from './services/entity_normalizer/entity_normalizer.service.js'
import { prepareNotificationObject } from './services/notification_utils/notification_utils.js'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

const messages = {
  ar: require('./lib/notification-i18n-loader.js!./i18n/ar.json'),
  ca: require('./lib/notification-i18n-loader.js!./i18n/ca.json'),
  cs: require('./lib/notification-i18n-loader.js!./i18n/cs.json'),
  de: require('./lib/notification-i18n-loader.js!./i18n/de.json'),
  eo: require('./lib/notification-i18n-loader.js!./i18n/eo.json'),
  es: require('./lib/notification-i18n-loader.js!./i18n/es.json'),
  et: require('./lib/notification-i18n-loader.js!./i18n/et.json'),
  eu: require('./lib/notification-i18n-loader.js!./i18n/eu.json'),
  fi: require('./lib/notification-i18n-loader.js!./i18n/fi.json'),
  fr: require('./lib/notification-i18n-loader.js!./i18n/fr.json'),
  ga: require('./lib/notification-i18n-loader.js!./i18n/ga.json'),
  he: require('./lib/notification-i18n-loader.js!./i18n/he.json'),
  hu: require('./lib/notification-i18n-loader.js!./i18n/hu.json'),
  it: require('./lib/notification-i18n-loader.js!./i18n/it.json'),
  ja: require('./lib/notification-i18n-loader.js!./i18n/ja_pedantic.json'),
  ja_easy: require('./lib/notification-i18n-loader.js!./i18n/ja_easy.json'),
  ko: require('./lib/notification-i18n-loader.js!./i18n/ko.json'),
  nb: require('./lib/notification-i18n-loader.js!./i18n/nb.json'),
  nl: require('./lib/notification-i18n-loader.js!./i18n/nl.json'),
  oc: require('./lib/notification-i18n-loader.js!./i18n/oc.json'),
  pl: require('./lib/notification-i18n-loader.js!./i18n/pl.json'),
  pt: require('./lib/notification-i18n-loader.js!./i18n/pt.json'),
  ro: require('./lib/notification-i18n-loader.js!./i18n/ro.json'),
  ru: require('./lib/notification-i18n-loader.js!./i18n/ru.json'),
  te: require('./lib/notification-i18n-loader.js!./i18n/te.json'),
  zh: require('./lib/notification-i18n-loader.js!./i18n/zh.json'),
  en: require('./lib/notification-i18n-loader.js!./i18n/en.json')
}

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
    let nj = await notification.json()
    nj = parseNotification(nj)

    const res = prepareNotificationObject(nj, i18n)

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
