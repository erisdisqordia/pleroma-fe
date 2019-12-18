import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import oauthApi from '../services/new_api/oauth.js'
import { compact, map, each, merge, last, concat, uniq } from 'lodash'
import { set } from 'vue'
import { registerPushNotifications, unregisterPushNotifications } from '../services/push/push.js'

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

const blockUser = (store, id) => {
  return store.rootState.api.backendInteractor.blockUser(id)
    .then((relationship) => {
      store.commit('updateUserRelationship', [relationship])
      store.commit('addBlockId', id)
      store.commit('removeStatus', { timeline: 'friends', userId: id })
      store.commit('removeStatus', { timeline: 'public', userId: id })
      store.commit('removeStatus', { timeline: 'publicAndExternal', userId: id })
    })
}

const unblockUser = (store, id) => {
  return store.rootState.api.backendInteractor.unblockUser(id)
    .then((relationship) => store.commit('updateUserRelationship', [relationship]))
}

const muteUser = (store, id) => {
  return store.rootState.api.backendInteractor.muteUser(id)
    .then((relationship) => {
      store.commit('updateUserRelationship', [relationship])
      store.commit('addMuteId', id)
    })
}

const unmuteUser = (store, id) => {
  return store.rootState.api.backendInteractor.unmuteUser(id)
    .then((relationship) => store.commit('updateUserRelationship', [relationship]))
}

const hideReblogs = (store, userId) => {
  return store.rootState.api.backendInteractor.followUser({ id: userId, reblogs: false })
    .then((relationship) => {
      store.commit('updateUserRelationship', [relationship])
    })
}

const showReblogs = (store, userId) => {
  return store.rootState.api.backendInteractor.followUser({ id: userId, reblogs: true })
    .then((relationship) => store.commit('updateUserRelationship', [relationship]))
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
  updateActivationStatus (state, { user: { id }, deactivated }) {
    const user = state.usersObject[id]
    set(user, 'deactivated', deactivated)
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
  saveFriendIds (state, { id, friendIds }) {
    const user = state.usersObject[id]
    user.friendIds = uniq(concat(user.friendIds, friendIds))
  },
  saveFollowerIds (state, { id, followerIds }) {
    const user = state.usersObject[id]
    user.followerIds = uniq(concat(user.followerIds, followerIds))
  },
  // Because frontend doesn't have a reason to keep these stuff in memory
  // outside of viewing someones user profile.
  clearFriends (state, userId) {
    const user = state.usersObject[userId]
    if (user) {
      set(user, 'friendIds', [])
    }
  },
  clearFollowers (state, userId) {
    const user = state.usersObject[userId]
    if (user) {
      set(user, 'followerIds', [])
    }
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
        user.subscribed = relationship.subscribing
        user.showing_reblogs = relationship.showing_reblogs
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
  addBlockId (state, blockId) {
    if (state.currentUser.blockIds.indexOf(blockId) === -1) {
      state.currentUser.blockIds.push(blockId)
    }
  },
  updateMutes (state, mutedUsers) {
    // Reset muted of all fetched users
    each(state.users, (user) => { user.muted = false })
    each(mutedUsers, (user) => mergeOrAdd(state.users, state.usersObject, user))
  },
  saveMuteIds (state, muteIds) {
    state.currentUser.muteIds = muteIds
  },
  addMuteId (state, muteId) {
    if (state.currentUser.muteIds.indexOf(muteId) === -1) {
      state.currentUser.muteIds.push(muteId)
    }
  },
  setPinnedToUser (state, status) {
    const user = state.usersObject[status.user.id]
    const index = user.pinnedStatusIds.indexOf(status.id)
    if (status.pinned && index === -1) {
      user.pinnedStatusIds.push(status.id)
    } else if (!status.pinned && index !== -1) {
      user.pinnedStatusIds.splice(index, 1)
    }
  },
  setUserForStatus (state, status) {
    status.user = state.usersObject[status.user.id]
  },
  setUserForNotification (state, notification) {
    if (notification.type !== 'follow') {
      notification.action.user = state.usersObject[notification.action.user.id]
    }
    notification.from_profile = state.usersObject[notification.from_profile.id]
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
      if (store.state.currentUser) {
        store.rootState.api.backendInteractor.fetchUserRelationship({ id })
          .then((relationships) => store.commit('updateUserRelationship', relationships))
      }
    },
    fetchBlocks (store) {
      return store.rootState.api.backendInteractor.fetchBlocks()
        .then((blocks) => {
          store.commit('saveBlockIds', map(blocks, 'id'))
          store.commit('updateBlocks', blocks)
          return blocks
        })
    },
    blockUser (store, id) {
      return blockUser(store, id)
    },
    unblockUser (store, id) {
      return unblockUser(store, id)
    },
    blockUsers (store, ids = []) {
      return Promise.all(ids.map(id => blockUser(store, id)))
    },
    unblockUsers (store, ids = []) {
      return Promise.all(ids.map(id => unblockUser(store, id)))
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
      return muteUser(store, id)
    },
    unmuteUser (store, id) {
      return unmuteUser(store, id)
    },
    hideReblogs (store, id) {
      return hideReblogs(store, id)
    },
    showReblogs (store, id) {
      return showReblogs(store, id)
    },
    muteUsers (store, ids = []) {
      return Promise.all(ids.map(id => muteUser(store, id)))
    },
    unmuteUsers (store, ids = []) {
      return Promise.all(ids.map(id => unmuteUser(store, id)))
    },
    fetchFriends ({ rootState, commit }, id) {
      const user = rootState.users.usersObject[id]
      const maxId = last(user.friendIds)
      return rootState.api.backendInteractor.fetchFriends({ id, maxId })
        .then((friends) => {
          commit('addNewUsers', friends)
          commit('saveFriendIds', { id, friendIds: map(friends, 'id') })
          return friends
        })
    },
    fetchFollowers ({ rootState, commit }, id) {
      const user = rootState.users.usersObject[id]
      const maxId = last(user.followerIds)
      return rootState.api.backendInteractor.fetchFollowers({ id, maxId })
        .then((followers) => {
          commit('addNewUsers', followers)
          commit('saveFollowerIds', { id, followerIds: map(followers, 'id') })
          return followers
        })
    },
    clearFriends ({ commit }, userId) {
      commit('clearFriends', userId)
    },
    clearFollowers ({ commit }, userId) {
      commit('clearFollowers', userId)
    },
    subscribeUser ({ rootState, commit }, id) {
      return rootState.api.backendInteractor.subscribeUser(id)
        .then((relationship) => commit('updateUserRelationship', [relationship]))
    },
    unsubscribeUser ({ rootState, commit }, id) {
      return rootState.api.backendInteractor.unsubscribeUser(id)
        .then((relationship) => commit('updateUserRelationship', [relationship]))
    },
    toggleActivationStatus ({ rootState, commit }, user) {
      const api = user.deactivated ? rootState.api.backendInteractor.activateUser : rootState.api.backendInteractor.deactivateUser
      api(user)
        .then(({ deactivated }) => commit('updateActivationStatus', { user, deactivated }))
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
    addNewUsers ({ commit }, users) {
      commit('addNewUsers', users)
    },
    addNewStatuses (store, { statuses }) {
      const users = map(statuses, 'user')
      const retweetedUsers = compact(map(statuses, 'retweeted_status.user'))
      store.commit('addNewUsers', users)
      store.commit('addNewUsers', retweetedUsers)

      each(statuses, (status) => {
        // Reconnect users to statuses
        store.commit('setUserForStatus', status)
        // Set pinned statuses to user
        store.commit('setPinnedToUser', status)
      })
      each(compact(map(statuses, 'retweeted_status')), (status) => {
        // Reconnect users to retweets
        store.commit('setUserForStatus', status)
        // Set pinned retweets to user
        store.commit('setPinnedToUser', status)
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
    searchUsers (store, query) {
      return store.rootState.api.backendInteractor.searchUsers(query)
        .then((users) => {
          store.commit('addNewUsers', users)
          return users
        })
    },
    async signUp (store, userInfo) {
      store.commit('signUpPending')

      let rootState = store.rootState

      try {
        let data = await rootState.api.backendInteractor.register(userInfo)
        store.commit('signUpSuccess')
        store.commit('setToken', data.access_token)
        store.dispatch('loginUser', data.access_token)
      } catch (e) {
        let errors = e.message
        store.commit('signUpFailure', errors)
        throw e
      }
    },
    async getCaptcha (store) {
      return store.rootState.api.backendInteractor.getCaptcha()
    },

    logout (store) {
      const { oauth, instance } = store.rootState

      const data = {
        ...oauth,
        commit: store.commit,
        instance: instance.server
      }

      return oauthApi.getOrCreateApp(data)
        .then((app) => {
          const params = {
            app,
            instance: data.instance,
            token: oauth.userToken
          }

          return oauthApi.revokeToken(params)
        })
        .then(() => {
          store.commit('clearCurrentUser')
          store.dispatch('disconnectFromSocket')
          store.commit('clearToken')
          store.dispatch('stopFetching', 'friends')
          store.commit('setBackendInteractor', backendInteractorService(store.getters.getToken()))
          store.dispatch('stopFetching', 'notifications')
          store.dispatch('stopFetching', 'followRequest')
          store.commit('clearNotifications')
          store.commit('resetStatuses')
        })
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

              store.dispatch('fetchEmoji')

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
                reject(new Error('Wrong username or password'))
              } else {
                reject(new Error('An error occurred, please try again'))
              }
            }
            commit('endLogin')
            resolve()
          })
          .catch((error) => {
            console.log(error)
            commit('endLogin')
            reject(new Error('Failed to connect to server, try again'))
          })
      })
    }
  }
}

export default users
