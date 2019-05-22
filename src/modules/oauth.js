const oauth = {
  state: {
    clientId: false,
    clientSecret: false,
    token: false,
    clientToken: false
  },
  mutations: {
    setClientData (state, { clientId, clientSecret }) {
      state.clientId = clientId
      state.clientSecret = clientSecret
    },
    setClientToken (state, token) {
      state.clientToken = token
    },
    setToken (state, token) {
      state.token = token
    }
  },
  getters: {
    getToken: state => () => {
      return state.token || state.clientToken
    }
  }
}

export default oauth
