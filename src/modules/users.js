import apiService from '../services/api/api.service.js'

const users = {
  state: {
    currentUser: false,
    loggingIn: false
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    beginLogin (state) {
      state.loggingIn = true
    },
    endLogin (state) {
      state.loggingIn = false
    }
  },
  actions: {
    loginUser ({commit, state}, userCredentials) {
      commit('beginLogin')
      apiService.verifyCredentials(userCredentials)
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((user) => commit('setCurrentUser', user))
          }
          commit('endLogin')
        })
        .catch((error) => {
          console.log(error)
          commit('endLogin')
        })
    }
  }
}

export default users
