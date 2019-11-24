import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { Socket } from 'phoenix'

const api = {
  state: {
    backendInteractor: backendInteractorService(),
    fetchers: {},
    socket: null,
    mastoSocket: null,
    followRequests: []
  },
  mutations: {
    setBackendInteractor (state, backendInteractor) {
      state.backendInteractor = backendInteractor
    },
    addFetcher (state, { fetcherName, fetcher }) {
      state.fetchers[fetcherName] = fetcher
    },
    removeFetcher (state, { fetcherName }) {
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
    }
  },
  actions: {
    startMastoSocket (store) {
      const { state, dispatch } = store
      state.mastoSocket = state.backendInteractor
        .startUserSocket({
          store,
          onMessage: (message) => {
            if (!message) return
            if (message.event === 'notification') {
              dispatch('addNewNotifications', {
                notifications: [message.notification],
                older: false
              })
            } else if (message.event === 'update') {
              dispatch('addNewStatuses', {
                statuses: [message.status],
                userId: false,
                showImmediately: false,
                timeline: 'friends'
              })
            }
          }
        })
      state.mastoSocket.addEventListener('error', error => {
        console.error('Error with MastoAPI websocket:', error)
        dispatch('startFetchingTimeline', { timeline: 'friends' })
        dispatch('startFetchingNotifications')
      })
    },
    startFetchingTimeline (store, { timeline = 'friends', tag = false, userId = false }) {
      // Don't start fetching if we already are.
      if (store.state.fetchers[timeline]) return

      const fetcher = store.state.backendInteractor.startFetchingTimeline({ timeline, store, userId, tag })
      store.commit('addFetcher', { fetcherName: timeline, fetcher })
    },
    startFetchingNotifications (store) {
      // Don't start fetching if we already are.
      if (store.state.fetchers['notifications']) return

      const fetcher = store.state.backendInteractor.startFetchingNotifications({ store })
      store.commit('addFetcher', { fetcherName: 'notifications', fetcher })
    },
    fetchAndUpdateNotifications (store) {
      store.state.backendInteractor.fetchAndUpdateNotifications({ store })
    },
    startFetchingFollowRequest (store) {
      // Don't start fetching if we already are.
      if (store.state.fetchers['followRequest']) return

      const fetcher = store.state.backendInteractor.startFetchingFollowRequest({ store })
      store.commit('addFetcher', { fetcherName: 'followRequest', fetcher })
    },
    stopFetching (store, fetcherName) {
      const fetcher = store.state.fetchers[fetcherName]
      window.clearInterval(fetcher)
      store.commit('removeFetcher', { fetcherName })
    },
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
    },
    removeFollowRequest (store, request) {
      let requests = store.state.followRequests.filter((it) => it !== request)
      store.commit('setFollowRequests', requests)
    }
  }
}

export default api
