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
      if (name === 'vapidPublicKey') {
        store.commit('setVapidPublicKey', value)

        if (store.state.token) {
          registerPushNotifications(store.rootState.config.webPushNotifications, value, store.state.token)
        }
      }
    },
    setCurrentUser (store, user) {
      store.commit('setApiToken', user.credentials)

      if (store.state.vapidPublicKey) {
        registerPushNotifications(store.rootState.config.webPushNotifications, store.state.vapidPublicKey, user.credentials)
      }
    }
  }
}

export default subscribe
