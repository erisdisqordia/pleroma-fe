import apiService from '../services/api/api.service.js'
import timelineFetcher from '../services/timeline_fetcher/timeline_fetcher.service.js'
import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'

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
    loginUser (store, userCredentials) {
      const commit = store.commit
      commit('beginLogin')
      return apiService.verifyCredentials(userCredentials)
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((user) => {
                user.credentials = userCredentials
                commit('setCurrentUser', user)
              })
              // Start getting fresh tweets.
              .then(() => timelineFetcher.startFetching({store, credentials: userCredentials}))
              // Set our new backend interactor
              .then(() => commit('setBackendInteractor', backendInteractorService(userCredentials)))
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
