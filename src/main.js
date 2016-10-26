import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import PublicTimeline from './components/public_timeline/public_timeline.vue'

import statuses from './modules/statuses.js'

Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store({
  modules: {
    statuses
  }
})

const routes = [
  { path: '/', redirect: '/main/public' },
  { path: '/main/public', component: PublicTimeline }
]

const router = new VueRouter({routes})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
})
