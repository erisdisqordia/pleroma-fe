import registerPushNotifications from '../services/push/push.js'

const subscribe = {
  state: {
    token: null,
    vapidPublicKey: null
  },
  mutations: {
    setApiToken (state, user) {
      state.token = user.credentials
    },
    setVapidPublicKey (state, vapidPublicKey) {
      state.vapidPublicKey = vapidPublicKey
    }

  },
  actions: {
    setInstanceOption (store, { name, value }) {
      store.commit('setVapidPublicKey', value)
      if (store.state.token) registerPushNotifications(this)
    },
    setCurrentUser (store, user) {
      store.commit('setApiToken', user.credentials)
      if (store.state.vapidPublicKey) registerPushNotifications(this)
    }
  }
}

export default subscribe
