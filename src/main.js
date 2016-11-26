import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import PublicTimeline from './components/public_timeline/public_timeline.vue'
import PublicAndExternalTimeline from './components/public_and_external_timeline/public_and_external_timeline.vue'
import FriendsTimeline from './components/friends_timeline/friends_timeline.vue'
import Conversation from './components/conversation/conversation.vue'

import statusesModule from './modules/statuses.js'
import usersModule from './modules/users.js'
import apiModule from './modules/api.js'

Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store({
  modules: {
    statuses: statusesModule,
    users: usersModule,
    api: apiModule
  }
})

const routes = [
  { path: '/', redirect: '/main/all' },
  { path: '/main/all', component: PublicAndExternalTimeline },
  { path: '/main/public', component: PublicTimeline },
  { path: '/main/friends', component: FriendsTimeline },
  { name: 'conversation', path: '/notice/:id', component: Conversation }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition || { x: 0, y: 0 }
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
