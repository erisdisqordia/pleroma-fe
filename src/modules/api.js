import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import { Socket } from 'phoenix'

const api = {
  state: {
    backendInteractor: backendInteractorService(),
    fetchers: {},
    socket: null,
    chatDisabled: false,
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
    setChatDisabled (state, value) {
      state.chatDisabled = value
    },
    setFollowRequests (state, value) {
      state.followRequests = value
    }
  },
  actions: {
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
    stopFetching (store, fetcherName) {
      const fetcher = store.state.fetchers[fetcherName]
      window.clearInterval(fetcher)
      store.commit('removeFetcher', { fetcherName })
    },
    setWsToken (store, token) {
      store.commit('setWsToken', token)
    },
    initializeSocket (store) {
      // Set up websocket connection
      if (!store.state.chatDisabled) {
        const token = store.state.wsToken
        const socket = new Socket('/socket', { params: { token } })
        socket.connect()
        store.dispatch('initializeChat', socket)
      }
    },
    disableChat (store) {
      store.commit('setChatDisabled', true)
    },
    removeFollowRequest (store, request) {
      let requests = store.state.followRequests.filter((it) => it !== request)
      store.commit('setFollowRequests', requests)
    }
  }
}

export default api
