import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { compact, map, each, merge, find } from 'lodash'
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
  addFriends (state, { id, friends, page }) {
    const user = state.usersObject[id]
    each(friends, friend => {
      if (!find(user.friends, { id: friend.id })) {
        user.friends.push(friend)
      }
    })
    user.friendsPage = page + 1
  },
  addFollowers (state, { id, followers, page }) {
    const user = state.usersObject[id]
    each(followers, follower => {
      if (!find(user.followers, { id: follower.id })) {
        user.followers.push(follower)
      }
    })
    user.followersPage = page + 1
  },
  // Because frontend doesn't have a reason to keep these stuff in memory
  // outside of viewing someones user profile.
  clearFriends (state, userId) {
    const user = state.usersObject[userId]
    if (!user) {
      return
    }
    user.friends = []
    user.friendsPage = 0
  },
  clearFollowers (state, userId) {
    const user = state.usersObject[userId]
    if (!user) {
      return
    }
    user.followers = []
    user.followersPage = 0
  },
  addNewUsers (state, users) {
    each(users, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  saveBlocks (state, blockIds) {
    state.currentUser.blockIds = blockIds
  },
  saveMutes (state, muteIds) {
    state.currentUser.muteIds = muteIds
  },
  setUserForStatus (state, status) {
    status.user = state.usersObject[status.user.id]
  },
  setUserForNotification (state, notification) {
    notification.action.user = state.usersObject[notification.action.user.id]
    notification.from_profile = state.usersObject[notification.action.user.id]
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

export const getters = {
  userById: state => id =>
    state.users.find(user => user.id === id),
  userByName: state => name =>
    state.users.find(user => user.screen_name &&
      (user.screen_name.toLowerCase() === name.toLowerCase())
    )
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
  getters,
  actions: {
    fetchUser (store, id) {
      return store.rootState.api.backendInteractor.fetchUser({ id })
        .then((user) => store.commit('addNewUsers', [user]))
    },
    fetchBlocks (store) {
      return store.rootState.api.backendInteractor.fetchBlocks()
        .then((blocks) => {
          store.commit('saveBlocks', map(blocks, 'id'))
          store.commit('addNewUsers', blocks)
          return blocks
        })
    },
    blockUser (store, id) {
      return store.rootState.api.backendInteractor.blockUser(id)
        .then((user) => store.commit('addNewUsers', [user]))
    },
    unblockUser (store, id) {
      return store.rootState.api.backendInteractor.unblockUser(id)
        .then((user) => store.commit('addNewUsers', [user]))
    },
    fetchMutes (store) {
      return store.rootState.api.backendInteractor.fetchMutes()
        .then((mutedUsers) => {
          each(mutedUsers, (user) => { user.muted = true })
          store.commit('addNewUsers', mutedUsers)
          store.commit('saveMutes', map(mutedUsers, 'id'))
        })
    },
    muteUser (store, id) {
      return store.state.api.backendInteractor.setUserMute({ id, muted: true })
        .then((user) => store.commit('addNewUsers', [user]))
    },
    unmuteUser (store, id) {
      return store.state.api.backendInteractor.setUserMute({ id, muted: false })
        .then((user) => store.commit('addNewUsers', [user]))
    },
    addFriends ({ rootState, commit }, fetchBy) {
      return new Promise((resolve, reject) => {
        const user = rootState.users.usersObject[fetchBy]
        const page = user.friendsPage || 1
        rootState.api.backendInteractor.fetchFriends({ id: user.id, page })
          .then((friends) => {
            commit('addFriends', { id: user.id, friends, page })
            resolve(friends)
          }).catch(() => {
            reject()
          })
      })
    },
    addFollowers ({ rootState, commit }, fetchBy) {
      const user = rootState.users.usersObject[fetchBy]
      const page = user.followersPage || 1
      return rootState.api.backendInteractor.fetchFollowers({ id: user.id, page })
        .then((followers) => {
          commit('addFollowers', { id: user.id, followers, page })
          return followers
        })
    },
    clearFriends ({ commit }, userId) {
      commit('clearFriends', userId)
    },
    clearFollowers ({ commit }, userId) {
      commit('clearFollowers', userId)
    },
    registerPushNotifications (store) {
      const token = store.state.currentUser.credentials
      const vapidPublicKey = store.rootState.instance.vapidPublicKey
      const isEnabled = store.rootState.config.webPushNotifications
      const notificationVisibility = store.rootState.config.notificationVisibility

      registerPushNotifications(isEnabled, vapidPublicKey, token, notificationVisibility)
    },
    unregisterPushNotifications (store) {
      const token = store.state.currentUser.credentials

      unregisterPushNotifications(token)
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
    addNewNotifications (store, { notifications }) {
      const users = map(notifications, 'from_profile')
      const notificationIds = notifications.map(_ => _.id)
      store.commit('addNewUsers', users)

      const notificationsObject = store.rootState.statuses.notifications.idStore
      const relevantNotifications = Object.entries(notificationsObject)
            .filter(([k, val]) => notificationIds.includes(k))
            .map(([k, val]) => val)

      // Reconnect users to notifications
      each(relevantNotifications, (notification) => {
        store.commit('setUserForNotification', notification)
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
        const data = await response.json()
        let errors = JSON.parse(data.error)
        // replace ap_id with username
        if (errors.ap_id) {
          errors.username = errors.ap_id
          delete errors.ap_id
        }
        errors = humanizeErrors(errors)
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
      store.dispatch('stopFetchingNotifications')
      store.commit('resetStatuses')
    },
    loginUser (store, accessToken) {
      return new Promise((resolve, reject) => {
        const commit = store.commit
        commit('beginLogin')
        store.rootState.api.backendInteractor.verifyCredentials(accessToken)
          .then((data) => {
            if (!data.error) {
              const user = data
              // user.credentials = userCredentials
              user.credentials = accessToken
              user.blockIds = []
              user.muteIds = []
              commit('setCurrentUser', user)
              commit('addNewUsers', [user])

              getNotificationPermission()
                .then(permission => commit('setNotificationPermission', permission))

              // Set our new backend interactor
              commit('setBackendInteractor', backendInteractorService(accessToken))

              if (user.token) {
                store.dispatch('setWsToken', user.token)
              }

              // Start getting fresh posts.
              store.dispatch('startFetching', { timeline: 'friends' })

              // Get user mutes
              store.dispatch('fetchMutes')

              // Fetch our friends
              store.rootState.api.backendInteractor.fetchFriends({ id: user.id })
                .then((friends) => commit('addNewUsers', friends))
            } else {
              const response = data.error
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
