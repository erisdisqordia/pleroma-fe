import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { WSConnectionStatus } from '../services/api/api.service.js'
import { Socket } from 'phoenix'

const api = {
  state: {
    backendInteractor: backendInteractorService(),
    fetchers: {},
    socket: null,
    mastoUserSocket: null,
    mastoUserSocketStatus: null,
    followRequests: []
  },
  mutations: {
    setBackendInteractor (state, backendInteractor) {
      state.backendInteractor = backendInteractor
    },
    addFetcher (state, { fetcherName, fetcher }) {
      state.fetchers[fetcherName] = fetcher
    },
    removeFetcher (state, { fetcherName, fetcher }) {
      window.clearInterval(fetcher)
      delete state.fetchers[fetcherName]
    },
    setWsToken (state, token) {
      state.wsToken = token
    },
    setSocket (state, socket) {
      state.socket = socket
    },
    setFollowRequests (state, value) {
      state.followRequests = value
    },
    setMastoUserSocketStatus (state, value) {
      state.mastoUserSocketStatus = value
    }
  },
  actions: {
    // Global MastoAPI socket control, in future should disable ALL sockets/(re)start relevant sockets
    enableMastoSockets (store) {
      const { state, dispatch } = store
      if (state.mastoUserSocket) return
      return dispatch('startMastoUserSocket')
    },
    disableMastoSockets (store) {
      const { state, dispatch } = store
      if (!state.mastoUserSocket) return
      return dispatch('stopMastoUserSocket')
    },

    // MastoAPI 'User' sockets
    startMastoUserSocket (store) {
      return new Promise((resolve, reject) => {
        try {
          const { state, commit, dispatch, rootState } = store
          const timelineData = rootState.statuses.timelines.friends
          state.mastoUserSocket = state.backendInteractor.startUserSocket({ store })
          state.mastoUserSocket.addEventListener(
            'message',
            ({ detail: message }) => {
              if (!message) return // pings
              if (message.event === 'notification') {
                dispatch('addNewNotifications', {
                  notifications: [message.notification],
                  older: false
                })
              } else if (message.event === 'update') {
                dispatch('addNewStatuses', {
                  statuses: [message.status],
                  userId: false,
                  showImmediately: timelineData.visibleStatuses.length === 0,
                  timeline: 'friends'
                })
              } else if (message.event === 'pleroma:chat_update') {
                dispatch('addChatMessages', {
                  chatId: message.chatUpdate.id,
                  messages: [message.chatUpdate.lastMessage]
                })
                dispatch('updateChat', { chat: message.chatUpdate })
              }
            }
          )
          state.mastoUserSocket.addEventListener('open', () => {
            commit('setMastoUserSocketStatus', WSConnectionStatus.JOINED)
          })
          state.mastoUserSocket.addEventListener('error', ({ detail: error }) => {
            console.error('Error in MastoAPI websocket:', error)
            commit('setMastoUserSocketStatus', WSConnectionStatus.ERROR)
            dispatch('clearOpenedChats')
          })
          state.mastoUserSocket.addEventListener('close', ({ detail: closeEvent }) => {
            const ignoreCodes = new Set([
              1000, // Normal (intended) closure
              1001 // Going away
            ])
            const { code } = closeEvent
            if (ignoreCodes.has(code)) {
              console.debug(`Not restarting socket becasue of closure code ${code} is in ignore list`)
            } else {
              console.warn(`MastoAPI websocket disconnected, restarting. CloseEvent code: ${code}`)
              dispatch('startFetchingTimeline', { timeline: 'friends' })
              dispatch('startFetchingNotifications')
              dispatch('startFetchingChats')
              dispatch('restartMastoUserSocket')
            }
            commit('setMastoUserSocketStatus', WSConnectionStatus.CLOSED)
            dispatch('clearOpenedChats')
          })
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    restartMastoUserSocket ({ dispatch }) {
      // This basically starts MastoAPI user socket and stops conventional
      // fetchers when connection reestablished
      return dispatch('startMastoUserSocket').then(() => {
        dispatch('stopFetchingTimeline', { timeline: 'friends' })
        dispatch('stopFetchingNotifications')
        dispatch('stopFetchingChats')
      })
    },
    stopMastoUserSocket ({ state, dispatch }) {
      dispatch('startFetchingTimeline', { timeline: 'friends' })
      dispatch('startFetchingNotifications')
      dispatch('startFetchingChats')
      state.mastoUserSocket.close()
    },

    // Timelines
    startFetchingTimeline (store, {
      timeline = 'friends',
      tag = false,
      userId = false
    }) {
      if (store.state.fetchers[timeline]) return

      const fetcher = store.state.backendInteractor.startFetchingTimeline({
        timeline, store, userId, tag
      })
      store.commit('addFetcher', { fetcherName: timeline, fetcher })
    },
    stopFetchingTimeline (store, timeline) {
      const fetcher = store.state.fetchers[timeline]
      if (!fetcher) return
      store.commit('removeFetcher', { fetcherName: timeline, fetcher })
    },

    // Notifications
    startFetchingNotifications (store) {
      if (store.state.fetchers.notifications) return
      const fetcher = store.state.backendInteractor.startFetchingNotifications({ store })
      store.commit('addFetcher', { fetcherName: 'notifications', fetcher })
    },
    stopFetchingNotifications (store) {
      const fetcher = store.state.fetchers.notifications
      if (!fetcher) return
      store.commit('removeFetcher', { fetcherName: 'notifications', fetcher })
    },

    // Follow requests
    startFetchingFollowRequests (store) {
      if (store.state.fetchers['followRequests']) return
      const fetcher = store.state.backendInteractor.startFetchingFollowRequests({ store })

      store.commit('addFetcher', { fetcherName: 'followRequests', fetcher })
    },
    stopFetchingFollowRequests (store) {
      const fetcher = store.state.fetchers.followRequests
      if (!fetcher) return
      store.commit('removeFetcher', { fetcherName: 'followRequests', fetcher })
    },
    removeFollowRequest (store, request) {
      let requests = store.state.followRequests.filter((it) => it !== request)
      store.commit('setFollowRequests', requests)
    },

    // Pleroma websocket
    setWsToken (store, token) {
      store.commit('setWsToken', token)
    },
    initializeSocket ({ dispatch, commit, state, rootState }) {
      // Set up websocket connection
      const token = state.wsToken
      if (rootState.instance.chatAvailable && typeof token !== 'undefined' && state.socket === null) {
        const socket = new Socket('/socket', { params: { token } })
        socket.connect()

        commit('setSocket', socket)
        dispatch('initializeChat', socket)
      }
    },
    disconnectFromSocket ({ commit, state }) {
      state.socket && state.socket.disconnect()
      commit('setSocket', null)
    }
  }
}

export default api
