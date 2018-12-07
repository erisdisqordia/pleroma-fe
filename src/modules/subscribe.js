import registerPushNotifications from '../services/push/push.js'

const subscribe = {
  state: {
    token: null,
    vapidPublicKey: null
  },
  mutations: {
    setCurrentUser (state, user) {
      state.token = user.credentials
      if (state.token && state.vapidPublicKey) registerPushNotifications(this)
    },
    setInstanceOption (state, { name, value }) {
      if (name !== 'vapidPublicKey') return
      state.vapidPublicKey = value
      if (state.token && state.vapidPublicKey) registerPushNotifications(this)
    }
  }
}

export default subscribe
