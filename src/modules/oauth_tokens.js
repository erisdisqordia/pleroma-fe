const oauthTokens = {
  state: {
    tokens: []
  },
  actions: {
    fetchTokens ({rootState, commit}) {
      rootState.api.backendInteractor.fetchOAuthTokens().then((tokens) => {
        commit('swapTokens', tokens)
      })
    },
    revokeToken ({rootState, commit, state}, id) {
      rootState.api.backendInteractor.revokeOAuthToken(id).then((response) => {
        if (response.status === 201) {
          commit('swapTokens', state.tokens.filter(token => token.id !== id))
        }
      })
    }
  },
  mutations: {
    swapTokens (state, tokens) {
      state.tokens = tokens
    }
  }
}

export default oauthTokens
