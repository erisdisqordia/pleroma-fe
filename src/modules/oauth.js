const oauth = {
  state: {
    clientId: false,
    clientSecret: false,
    appToken: false,
    userToken: false
  },
  mutations: {
    setClientData (state, { clientId, clientSecret }) {
      state.clientId = clientId
      state.clientSecret = clientSecret
    },
    setClientToken (state, token) {
      state.appToken = token
    },
    setToken (state, token) {
      state.userToken = token
    }
  },
  getters: {
    getToken: state => () => {
      return state.userToken || state.appToken
    }
  }
}

export default oauth
