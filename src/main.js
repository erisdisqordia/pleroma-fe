import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import PublicTimeline from './components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from './components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from './components/friends_timeline/friends_timeline.vue'
import ConversationPage from './components/conversation-page/conversation-page.vue'
import Mentions from './components/mentions/mentions.vue'
import UserProfile from './components/user_profile/user_profile.vue'
import Settings from './components/settings/settings.vue'

import statusesModule from './modules/statuses.js'
import usersModule from './modules/users.js'
import apiModule from './modules/api.js'
import configModule from './modules/config.js'

import VueTimeago from 'vue-timeago'

import createPersistedState from './lib/persisted_state.js'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueTimeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('../static/timeago.json')
  }
})

const persistedStateOptions = {
  paths: [
    'config.hideAttachments',
    'config.hideAttachmentsInConv',
    'config.hideNsfw',
    'config.autoLoad',
    'config.muteWords',
    'statuses.notifications',
    'users.users'
  ]
}

const store = new Vuex.Store({
  modules: {
    statuses: statusesModule,
    users: usersModule,
    api: apiModule,
    config: configModule
  },
  plugins: [createPersistedState(persistedStateOptions)],
  strict: process.env.NODE_ENV !== 'production'
})

const routes = [
  { name: 'root', path: '/', redirect: '/main/all' },
  { path: '/main/all', component: PublicAndExternalTimeline },
  { path: '/main/public', component: PublicTimeline },
  { path: '/main/friends', component: FriendsTimeline },
  { name: 'conversation', path: '/notice/:id', component: ConversationPage, meta: { dontScroll: true } },
  { name: 'user-profile', path: '/users/:id', component: UserProfile },
  { name: 'mentions', path: '/:username/mentions', component: Mentions },
  { name: 'settings', path: '/settings', component: Settings }
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
  el: '#app',
  render: h => h(App)
})

window.fetch('/static/config.json')
  .then((res) => res.json())
  .then(({name, theme, background, logo}) => {
    store.dispatch('setOption', { name: 'name', value: name })
    store.dispatch('setOption', { name: 'theme', value: theme })
    store.dispatch('setOption', { name: 'background', value: background })
    store.dispatch('setOption', { name: 'logo', value: logo })
  })
