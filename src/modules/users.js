import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { compact, map, each, merge } from 'lodash'
import { set } from 'vue'
import { registerPushNotifications, unregisterPushNotifications } from '../services/push/push.js'
import oauthApi from '../services/new_api/oauth'
import { humanizeErrors } from './errors'

// TODO: Unify with mergeOrAdd in statuses.js
export const mergeOrAdd = (arr, obj, item) => {
  if (!item) { return false }
  const oldItem = obj[item.id]
  if (oldItem) {
    // We already have this, so only merge the new info.
    merge(oldItem, item)
    return { item: oldItem, new: false }
  } else {
    // This is a new item, prepare it
    arr.push(item)
    obj[item.id] = item
    if (item.screen_name && !item.screen_name.includes('@')) {
      obj[item.screen_name] = item
    }
    return { item, new: true }
  }
}

const getNotificationPermission = () => {
  const Notification = window.Notification

  if (!Notification) return Promise.resolve(null)
  if (Notification.permission === 'default') return Notification.requestPermission()
  return Promise.resolve(Notification.permission)
}

export const mutations = {
  setMuted (state, { user: { id }, muted }) {
    const user = state.usersObject[id]
    set(user, 'muted', muted)
  },
  setCurrentUser (state, user) {
    state.lastLoginName = user.screen_name
    state.currentUser = merge(state.currentUser || {}, user)
  },
  clearCurrentUser (state) {
    state.currentUser = false
    state.lastLoginName = false
  },
  beginLogin (state) {
    state.loggingIn = true
  },
  endLogin (state) {
    state.loggingIn = false
  },
  // TODO Clean after ourselves?
  addFriends (state, { id, friends }) {
    const user = state.usersObject[id]
    user.friends = friends
  },
  addFollowers (state, { id, followers }) {
    const user = state.usersObject[id]
    user.followers = followers
  },
  addNewUsers (state, users) {
    each(users, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  setUserForStatus (state, status) {
    status.user = state.usersObject[status.user.id]
  },
  setColor (state, { user: { id }, highlighted }) {
    const user = state.usersObject[id]
    set(user, 'highlight', highlighted)
  },
  signUpPending (state) {
    state.signUpPending = true
    state.signUpErrors = []
  },
  signUpSuccess (state) {
    state.signUpPending = false
  },
  signUpFailure (state, errors) {
    state.signUpPending = false
    state.signUpErrors = errors
  }
}

export const defaultState = {
  loggingIn: false,
  lastLoginName: false,
  currentUser: false,
  users: [],
  usersObject: {},
  signUpPending: false,
  signUpErrors: []
}

const users = {
  state: defaultState,
  mutations,
  actions: {
    fetchUser (store, id) {
      store.rootState.api.backendInteractor.fetchUser({ id })
        .then((user) => store.commit('addNewUsers', [user]))
    },
    addFriends ({ rootState, commit }, { id }) {
      rootState.api.backendInteractor.fetchFriends({ id })
        .then((friends) => commit('addFriends', { id, friends }))
    },
    addFollowers ({ rootState, commit }, { id }) {
      rootState.api.backendInteractor.fetchFollowers({ id })
        .then((followers) => commit('addFollowers', { id, followers }))
    },
    registerPushNotifications (store) {
      const token = store.state.currentUser.credentials
      const vapidPublicKey = store.rootState.instance.vapidPublicKey
      const isEnabled = store.rootState.config.webPushNotifications

      registerPushNotifications(isEnabled, vapidPublicKey, token)
    },
    unregisterPushNotifications (store) {
      unregisterPushNotifications()
    },
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
    async signUp (store, userInfo) {
      store.commit('signUpPending')

      let rootState = store.rootState

      let response = await rootState.api.backendInteractor.register(userInfo)
      if (response.ok) {
        const data = {
          oauth: rootState.oauth,
          instance: rootState.instance.server
        }
        let app = await oauthApi.getOrCreateApp(data)
        let result = await oauthApi.getTokenWithCredentials({
          app,
          instance: data.instance,
          username: userInfo.username,
          password: userInfo.password
        })
        store.commit('signUpSuccess')
        store.commit('setToken', result.access_token)
        store.dispatch('loginUser', result.access_token)
      } else {
        let data = await response.json()
        let errors = humanizeErrors(JSON.parse(data.error))
        store.commit('signUpFailure', errors)
        throw Error(errors)
      }
    },
    async getCaptcha (store) {
      return await store.rootState.api.backendInteractor.getCaptcha()
    },

    logout (store) {
      store.commit('clearCurrentUser')
      store.commit('setToken', false)
      store.dispatch('stopFetching', 'friends')
      store.commit('setBackendInteractor', backendInteractorService())
    },
    loginUser (store, accessToken) {
      return new Promise((resolve, reject) => {
        const commit = store.commit
        commit('beginLogin')
        store.rootState.api.backendInteractor.verifyCredentials(accessToken)
          .then((response) => {
            if (response.ok) {
              response.json()
                .then((user) => {
                  // user.credentials = userCredentials
                  user.credentials = accessToken
                  commit('setCurrentUser', user)
                  commit('addNewUsers', [user])

                  getNotificationPermission()
                    .then(permission => commit('setNotificationPermission', permission))

                  // Set our new backend interactor
                  commit('setBackendInteractor', backendInteractorService(accessToken))

                  if (user.token) {
                    store.dispatch('initializeSocket', user.token)
                  }

                  // Start getting fresh tweets.
                  store.dispatch('startFetching', 'friends')

                  // Get user mutes and follower info
                  store.rootState.api.backendInteractor.fetchMutes().then((mutedUsers) => {
                    each(mutedUsers, (user) => { user.muted = true })
                    store.commit('addNewUsers', mutedUsers)
                  })

                  // Fetch our friends
                  store.rootState.api.backendInteractor.fetchFriends({ id: user.id })
                    .then((friends) => commit('addNewUsers', friends))
                })
            } else {
              // Authentication failed
              commit('endLogin')
              if (response.status === 401) {
                reject('Wrong username or password')
              } else {
                reject('An error occurred, please try again')
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
