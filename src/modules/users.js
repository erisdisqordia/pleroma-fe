import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { compact, map, each, merge, find, last } from 'lodash'
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
    set(obj, item.id, item)
    if (item.screen_name && !item.screen_name.includes('@')) {
      set(obj, item.screen_name.toLowerCase(), item)
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
  tagUser (state, { user: { id }, tag }) {
    const user = state.usersObject[id]
    const tags = user.tags || []
    const newTags = tags.concat([tag])
    set(user, 'tags', newTags)
  },
  untagUser (state, { user: { id }, tag }) {
    const user = state.usersObject[id]
    const tags = user.tags || []
    const newTags = tags.filter(t => t !== tag)
    set(user, 'tags', newTags)
  },
  updateRight (state, { user: { id }, right, value }) {
    const user = state.usersObject[id]
    let newRights = user.rights
    newRights[right] = value
    set(user, 'rights', newRights)
  },
  updateActivationStatus (state, { user: { id }, status }) {
    const user = state.usersObject[id]
    set(user, 'deactivated', !status)
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
    each(friends, friend => {
      if (!find(user.friends, { id: friend.id })) {
        user.friends.push(friend)
      }
    })
    user.lastFriendId = last(friends).id
  },
  addFollowers (state, { id, followers }) {
    const user = state.usersObject[id]
    each(followers, follower => {
      if (!find(user.followers, { id: follower.id })) {
        user.followers.push(follower)
      }
    })
    user.lastFollowerId = last(followers).id
  },
  // Because frontend doesn't have a reason to keep these stuff in memory
  // outside of viewing someones user profile.
  clearFriends (state, userId) {
    const user = state.usersObject[userId]
    if (!user) {
      return
    }
    user.friends = []
    user.lastFriendId = null
  },
  clearFollowers (state, userId) {
    const user = state.usersObject[userId]
    if (!user) {
      return
    }
    user.followers = []
    user.lastFollowerId = null
  },
  addNewUsers (state, users) {
    each(users, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  updateUserRelationship (state, relationships) {
    relationships.forEach((relationship) => {
      const user = state.usersObject[relationship.id]
      if (user) {
        user.follows_you = relationship.followed_by
        user.following = relationship.following
        user.muted = relationship.muting
        user.statusnet_blocking = relationship.blocking
      }
    })
  },
  updateBlocks (state, blockedUsers) {
    // Reset statusnet_blocking of all fetched users
    each(state.users, (user) => { user.statusnet_blocking = false })
    each(blockedUsers, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  saveBlockIds (state, blockIds) {
    state.currentUser.blockIds = blockIds
  },
  updateMutes (state, mutedUsers) {
    // Reset muted of all fetched users
    each(state.users, (user) => { user.muted = false })
    each(mutedUsers, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  saveMuteIds (state, muteIds) {
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
  findUser: state => query => {
    const result = state.usersObject[query]
    // In case it's a screen_name, we can try searching case-insensitive
    if (!result && typeof query === 'string') {
      return state.usersObject[query.toLowerCase()]
    }
    return result
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
  getters,
  actions: {
    fetchUser (store, id) {
      return store.rootState.api.backendInteractor.fetchUser({ id })
        .then((user) => {
          store.commit('addNewUsers', [user])
          return user
        })
    },
    fetchUserRelationship (store, id) {
      return store.rootState.api.backendInteractor.fetchUserRelationship({ id })
        .then((relationships) => store.commit('updateUserRelationship', relationships))
    },
    fetchBlocks (store) {
      return store.rootState.api.backendInteractor.fetchBlocks()
        .then((blocks) => {
          store.commit('saveBlockIds', map(blocks, 'id'))
          store.commit('updateBlocks', blocks)
          return blocks
        })
    },
    blockUser (store, userId) {
      return store.rootState.api.backendInteractor.blockUser(userId)
        .then((relationship) => {
          store.commit('updateUserRelationship', [relationship])
          store.commit('removeStatus', { timeline: 'friends', userId })
          store.commit('removeStatus', { timeline: 'public', userId })
          store.commit('removeStatus', { timeline: 'publicAndExternal', userId })
        })
    },
    unblockUser (store, id) {
      return store.rootState.api.backendInteractor.unblockUser(id)
        .then((relationship) => store.commit('updateUserRelationship', [relationship]))
    },
    fetchMutes (store) {
      return store.rootState.api.backendInteractor.fetchMutes()
        .then((mutes) => {
          store.commit('updateMutes', mutes)
          store.commit('saveMuteIds', map(mutes, 'id'))
          return mutes
        })
    },
    muteUser (store, id) {
      return store.rootState.api.backendInteractor.muteUser(id)
        .then((relationship) => store.commit('updateUserRelationship', [relationship]))
    },
    unmuteUser (store, id) {
      return store.rootState.api.backendInteractor.unmuteUser(id)
        .then((relationship) => store.commit('updateUserRelationship', [relationship]))
    },
    addFriends ({ rootState, commit }, fetchBy) {
      return new Promise((resolve, reject) => {
        const user = rootState.users.usersObject[fetchBy]
        const maxId = user.lastFriendId
        rootState.api.backendInteractor.fetchFriends({ id: user.id, maxId })
          .then((friends) => {
            commit('addFriends', { id: user.id, friends })
            resolve(friends)
          }).catch(() => {
            reject()
          })
      })
    },
    addFollowers ({ rootState, commit }, fetchBy) {
      const user = rootState.users.usersObject[fetchBy]
      const maxId = user.lastFollowerId
      return rootState.api.backendInteractor.fetchFollowers({ id: user.id, maxId })
        .then((followers) => {
          commit('addFollowers', { id: user.id, followers })
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
      store.dispatch('disconnectFromChat')
      store.commit('setToken', false)
      store.dispatch('stopFetching', 'friends')
      store.commit('setBackendInteractor', backendInteractorService())
      store.dispatch('stopFetching', 'notifications')
      store.commit('clearNotifications')
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

                // Initialize the chat socket.
                store.dispatch('initializeSocket')
              }

              // Start getting fresh posts.
              store.dispatch('startFetchingTimeline', { timeline: 'friends' })

              // Start fetching notifications
              store.dispatch('startFetchingNotifications')

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
