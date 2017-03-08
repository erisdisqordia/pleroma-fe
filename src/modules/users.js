import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { compact, map, each, find, merge } from 'lodash'
import { set } from 'vue'

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
  setMuted (state, { user: {id}, muted }) {
    const user = find(state.users, {id})
    set(user, 'muted', muted)
  },
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
  },
  setUserForStatus (state, status) {
    status.user = find(state.users, status.user)
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
      const retweetedUsers = compact(map(statuses, 'retweeted_status.user'))
      store.commit('addNewUsers', users)
      store.commit('addNewUsers', retweetedUsers)

      // Reconnect users to statuses
      each(statuses, (status) => {
        store.commit('setUserForStatus', status)
      })
      // Reconnect users to retweets
      each(compact(map(statuses, 'retweeted_status')), (status) => {
        store.commit('setUserForStatus', status)
      })
    },
    loginUser (store, userCredentials) {
      return new Promise((resolve, reject) => {
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

                  // Set our new backend interactor
                  commit('setBackendInteractor', backendInteractorService(userCredentials))

                  // Start getting fresh tweets.
                  store.dispatch('startFetching', 'friends')

                  // Get user mutes and follower info
                  store.rootState.api.backendInteractor.fetchMutes().then((mutedUsers) => {
                    each(mutedUsers, (user) => { user.muted = true })
                    store.commit('addNewUsers', mutedUsers)
                  })

                  // Fetch our friends
                  store.rootState.api.backendInteractor.fetchFriends()
                    .then((friends) => commit('addNewUsers', friends))
                })
            } else {
              // Authentication failed
              commit('endLogin')
              if (response.status === 401) {
                reject('Wrong username or password')
              } else {
                reject('An error occured, please try again')
              }
            }
            commit('endLogin')
            resolve()
          })
          .catch((error) => {
            console.log(error)
            commit('endLogin')
            reject('Failed to connect to server, try again')
          })
      })
    }
  }
}

export default users
