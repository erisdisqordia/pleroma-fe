import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import interfaceModule from './modules/interface.js'
import instanceModule from './modules/instance.js'
import statusesModule from './modules/statuses.js'
import usersModule from './modules/users.js'
import apiModule from './modules/api.js'
import configModule from './modules/config.js'
import chatModule from './modules/chat.js'
import oauthModule from './modules/oauth.js'
import mediaViewerModule from './modules/media_viewer.js'

import VueTimeago from 'vue-timeago'
import VueI18n from 'vue-i18n'

import createPersistedState from './lib/persisted_state.js'
import pushNotifications from './lib/push_notifications_plugin.js'

import messages from './i18n/messages.js'

import VueChatScroll from 'vue-chat-scroll'

import afterStoreSetup from './boot/after_store.js'

const currentLocale = (window.navigator.language || 'en').split('-')[0]

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueTimeago, {
  locale: currentLocale === 'ja' ? 'ja' : 'en',
  locales: {
    'en': require('../static/timeago-en.json'),
    'ja': require('../static/timeago-ja.json')
  }
})
Vue.use(VueI18n)
Vue.use(VueChatScroll)

const i18n = new VueI18n({
  // By default, use the browser locale, we will update it if neccessary
  locale: currentLocale,
  fallbackLocale: 'en',
  messages
})

const persistedStateOptions = {
  paths: [
    'config',
    'users.lastLoginName',
    'oauth'
  ]
}

createPersistedState(persistedStateOptions).then((persistedState) => {
  const store = new Vuex.Store({
    modules: {
      interface: interfaceModule,
      instance: instanceModule,
      statuses: statusesModule,
      users: usersModule,
      api: apiModule,
      config: configModule,
      chat: chatModule,
      oauth: oauthModule,
      mediaViewer: mediaViewerModule
    },
    plugins: [persistedState, pushNotifications],
    strict: false // Socket modifies itself, let's ignore this for now.
    // strict: process.env.NODE_ENV !== 'production'
  })

  afterStoreSetup({ store, i18n })
})

// These are inlined by webpack's DefinePlugin
/* eslint-disable */
window.___pleromafe_mode = process.env
window.___pleromafe_commit_hash = COMMIT_HASH
window.___pleromafe_dev_overrides = DEV_OVERRIDES
