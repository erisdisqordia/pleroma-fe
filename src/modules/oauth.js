const oauth = {
  state: {
    client_id: false,
    client_secret: false,
    token: false
  },
  mutations: {
    setClientData (state, data) {
      state.client_id = data.client_id
      state.client_secret = data.client_secret
    },
    setToken (state, token) {
      state.token = token
    }
  }
}

export default oauth
