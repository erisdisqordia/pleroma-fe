import timelineFetcher from '../services/timeline_fetcher/timeline_fetcher.service.js'
import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { map, each, find, merge } from 'lodash'

// TODO: Unify with mergeOrAdd in statuses.js
export const mergeOrAdd = (arr, item) => {
  if (!item) { return false }
  const oldItem = find(arr, {id: item.id})
  if (oldItem) {
    // We already have this, so only merge the new info.
    merge(oldItem, item)
    return {item: oldItem, new: false}
  } else {
    // This is a new item, prepare it
    arr.push(item)
    return {item, new: true}
  }
}

export const mutations = {
  setCurrentUser (state, user) {
    state.currentUser = user
  },
  beginLogin (state) {
    state.loggingIn = true
  },
  endLogin (state) {
    state.loggingIn = false
  },
  addNewUsers (state, users) {
    each(users, (user) => mergeOrAdd(state.users, user))
  }
}

export const defaultState = {
  currentUser: false,
  loggingIn: false,
  users: []
}

const users = {
  state: defaultState,
  mutations,
  actions: {
    addNewStatuses (store, { statuses }) {
      const users = map(statuses, 'user')
      store.commit('addNewUsers', users)
    },
    loginUser (store, userCredentials) {
      const commit = store.commit
      commit('beginLogin')
      store.rootState.api.backendInteractor.verifyCredentials(userCredentials)
        .then((response) => {
          if (response.ok) {
            response.json()
              .then((user) => {
                user.credentials = userCredentials
                commit('setCurrentUser', user)
                commit('addNewUsers', [user])

                // Start getting fresh tweets.
                timelineFetcher.startFetching({store, credentials: userCredentials})

                // Set our new backend interactor
                commit('setBackendInteractor', backendInteractorService(userCredentials))

                // Fetch our friends
                store.rootState.api.backendInteractor.fetchFriends()
                  .then((friends) => commit('addNewUsers', friends))
              })
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
