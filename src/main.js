import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import PublicTimeline from './components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from './components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from './components/friends_timeline/friends_timeline.vue'
import TagTimeline from './components/tag_timeline/tag_timeline.vue'
import ConversationPage from './components/conversation-page/conversation-page.vue'
import Mentions from './components/mentions/mentions.vue'
import UserProfile from './components/user_profile/user_profile.vue'
import Settings from './components/settings/settings.vue'
import Registration from './components/registration/registration.vue'
import UserSettings from './components/user_settings/user_settings.vue'
import FollowRequests from './components/follow_requests/follow_requests.vue'

import statusesModule from './modules/statuses.js'
import usersModule from './modules/users.js'
import apiModule from './modules/api.js'
import configModule from './modules/config.js'
import chatModule from './modules/chat.js'

import VueTimeago from 'vue-timeago'
import VueI18n from 'vue-i18n'

import createPersistedState from './lib/persisted_state.js'

import messages from './i18n/messages.js'

import VueChatScroll from 'vue-chat-scroll'

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

const persistedStateOptions = {
  paths: [
    'config.hideAttachments',
    'config.hideAttachmentsInConv',
    'config.hideNsfw',
    'config.autoLoad',
    'config.hoverPreview',
    'config.streaming',
    'config.muteWords',
    'config.customTheme',
    'config.highlight',
    'config.loopVideo',
    'config.loopVideoSilentOnly',
    'config.pauseOnUnfocused',
    'config.stopGifs',
    'users.lastLoginName'
  ]
}

const store = new Vuex.Store({
  modules: {
    statuses: statusesModule,
    users: usersModule,
    api: apiModule,
    config: configModule,
    chat: chatModule
  },
  plugins: [createPersistedState(persistedStateOptions)],
  strict: false // Socket modifies itself, let's ignore this for now.
  // strict: process.env.NODE_ENV !== 'production'
})

const i18n = new VueI18n({
  locale: currentLocale,
  fallbackLocale: 'en',
  messages
})

window.fetch('/api/statusnet/config.json')
  .then((res) => res.json())
  .then((data) => {
    const {name, closed: registrationClosed, textlimit, server} = data.site

    store.dispatch('setOption', { name: 'name', value: name })
    store.dispatch('setOption', { name: 'registrationOpen', value: (registrationClosed === '0') })
    store.dispatch('setOption', { name: 'textlimit', value: parseInt(textlimit) })
    store.dispatch('setOption', { name: 'server', value: server })
  })

window.fetch('/static/config.json')
  .then((res) => res.json())
  .then((data) => {
    const {theme, background, logo, showWhoToFollowPanel, whoToFollowProvider, whoToFollowLink, showInstanceSpecificPanel, scopeOptionsEnabled} = data
    store.dispatch('setOption', { name: 'theme', value: theme })
    store.dispatch('setOption', { name: 'background', value: background })
    store.dispatch('setOption', { name: 'logo', value: logo })
    store.dispatch('setOption', { name: 'showWhoToFollowPanel', value: showWhoToFollowPanel })
    store.dispatch('setOption', { name: 'whoToFollowProvider', value: whoToFollowProvider })
    store.dispatch('setOption', { name: 'whoToFollowLink', value: whoToFollowLink })
    store.dispatch('setOption', { name: 'showInstanceSpecificPanel', value: showInstanceSpecificPanel })
    store.dispatch('setOption', { name: 'scopeOptionsEnabled', value: scopeOptionsEnabled })
    if (data['chatDisabled']) {
      store.dispatch('disableChat')
    }

    const routes = [
      { name: 'root',
        path: '/',
        redirect: to => {
          var redirectRootLogin = data['redirectRootLogin']
          var redirectRootNoLogin = data['redirectRootNoLogin']
          return (store.state.users.currentUser ? redirectRootLogin : redirectRootNoLogin) || '/main/all'
        }},
      { path: '/main/all', component: PublicAndExternalTimeline },
      { path: '/main/public', component: PublicTimeline },
      { path: '/main/friends', component: FriendsTimeline },
      { path: '/tag/:tag', component: TagTimeline },
      { name: 'conversation', path: '/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
      { name: 'user-profile', path: '/users/:id', component: UserProfile },
      { name: 'mentions', path: '/:username/mentions', component: Mentions },
      { name: 'settings', path: '/settings', component: Settings },
      { name: 'registration', path: '/registration', component: Registration },
      { name: 'registration', path: '/registration/:token', component: Registration },
      { name: 'friend-requests', path: '/friend-requests', component: FollowRequests },
      { name: 'user-settings', path: '/user-settings', component: UserSettings }
    ]

    const router = new VueRouter({
      mode: 'history',
      routes,
      scrollBehavior: (to, from, savedPosition) => {
        if (to.matched.some(m => m.meta.dontScroll)) {
          return false
        }
        return savedPosition || { x: 0, y: 0 }
      }
    })

    /* eslint-disable no-new */
    new Vue({
      router,
      store,
      i18n,
      el: '#app',
      render: h => h(App)
    })
  })

window.fetch('/static/terms-of-service.html')
  .then((res) => res.text())
  .then((html) => {
    store.dispatch('setOption', { name: 'tos', value: html })
  })

window.fetch('/api/pleroma/emoji.json')
  .then(
    (res) => res.json()
      .then(
        (values) => {
          const emoji = Object.keys(values).map((key) => {
            return { shortcode: key, image_url: values[key] }
          })
          store.dispatch('setOption', { name: 'customEmoji', value: emoji })
          store.dispatch('setOption', { name: 'pleromaBackend', value: true })
        },
        (failure) => {
          store.dispatch('setOption', { name: 'pleromaBackend', value: false })
        }
      ),
    (error) => console.log(error)
  )

window.fetch('/static/emoji.json')
  .then((res) => res.json())
  .then((values) => {
    const emoji = Object.keys(values).map((key) => {
      return { shortcode: key, image_url: false, 'utf': values[key] }
    })
    store.dispatch('setOption', { name: 'emoji', value: emoji })
  })

window.fetch('/instance/panel.html')
  .then((res) => res.text())
  .then((html) => {
    store.dispatch('setOption', { name: 'instanceSpecificPanelContent', value: html })
  })

