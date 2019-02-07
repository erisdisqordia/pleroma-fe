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
    addFetcher (state, {timeline, fetcher}) {
      state.fetchers[timeline] = fetcher
    },
    removeFetcher (state, {timeline}) {
      delete state.fetchers[timeline]
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
    startFetching (store, {timeline = 'friends', tag = false, userId = false}) {
      // Don't start fetching if we already are.
      if (store.state.fetchers[timeline]) return

      const fetcher = store.state.backendInteractor.startFetching({ timeline, store, userId, tag })
      store.commit('addFetcher', { timeline, fetcher })
    },
    stopFetching (store, timeline) {
      const fetcher = store.state.fetchers[timeline]
      window.clearInterval(fetcher)
      store.commit('removeFetcher', {timeline})
    },
    setWsToken (store, token) {
      store.commit('setWsToken', token)
    },
    initializeSocket (store) {
      // Set up websocket connection
      if (!store.state.chatDisabled) {
        const token = store.state.wsToken
        const socket = new Socket('/socket', {params: {token}})
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
