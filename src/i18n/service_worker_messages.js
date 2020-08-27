/* eslint-disable import/no-webpack-loader-syntax */
// This module exports only the notification part of the i18n,
// which is useful for the service worker

const messages = {
  ar: require('../lib/notification-i18n-loader.js!./ar.json'),
  ca: require('../lib/notification-i18n-loader.js!./ca.json'),
  cs: require('../lib/notification-i18n-loader.js!./cs.json'),
  de: require('../lib/notification-i18n-loader.js!./de.json'),
  eo: require('../lib/notification-i18n-loader.js!./eo.json'),
  es: require('../lib/notification-i18n-loader.js!./es.json'),
  et: require('../lib/notification-i18n-loader.js!./et.json'),
  eu: require('../lib/notification-i18n-loader.js!./eu.json'),
  fi: require('../lib/notification-i18n-loader.js!./fi.json'),
  fr: require('../lib/notification-i18n-loader.js!./fr.json'),
  ga: require('../lib/notification-i18n-loader.js!./ga.json'),
  he: require('../lib/notification-i18n-loader.js!./he.json'),
  hu: require('../lib/notification-i18n-loader.js!./hu.json'),
  it: require('../lib/notification-i18n-loader.js!./it.json'),
  ja: require('../lib/notification-i18n-loader.js!./ja_pedantic.json'),
  ja_easy: require('../lib/notification-i18n-loader.js!./ja_easy.json'),
  ko: require('../lib/notification-i18n-loader.js!./ko.json'),
  nb: require('../lib/notification-i18n-loader.js!./nb.json'),
  nl: require('../lib/notification-i18n-loader.js!./nl.json'),
  oc: require('../lib/notification-i18n-loader.js!./oc.json'),
  pl: require('../lib/notification-i18n-loader.js!./pl.json'),
  pt: require('../lib/notification-i18n-loader.js!./pt.json'),
  ro: require('../lib/notification-i18n-loader.js!./ro.json'),
  ru: require('../lib/notification-i18n-loader.js!./ru.json'),
  te: require('../lib/notification-i18n-loader.js!./te.json'),
  zh: require('../lib/notification-i18n-loader.js!./zh.json'),
  en: require('../lib/notification-i18n-loader.js!./en.json')
}

export default messages
