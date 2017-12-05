import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'
import {isArray} from 'lodash'
import { Socket } from 'phoenix'

const api = {
  state: {
    backendInteractor: backendInteractorService(),
    fetchers: {},
    socket: null
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
    setSocket (state, socket) {
      state.socket = socket
    }
  },
  actions: {
    startFetching (store, timeline) {
      let userId = false

      // This is for user timelines
      if (isArray(timeline)) {
        userId = timeline[1]
        timeline = timeline[0]
      }

      // Don't start fetching if we already are.
      if (!store.state.fetchers[timeline]) {
        const fetcher = store.state.backendInteractor.startFetching({timeline, store, userId})
        store.commit('addFetcher', {timeline, fetcher})
      }
    },
    stopFetching (store, timeline) {
      const fetcher = store.state.fetchers[timeline]
      window.clearInterval(fetcher)
      store.commit('removeFetcher', {timeline})
    },
    initializeSocket (store, token) {
      // Set up websocket connection
      let socket = new Socket('/socket', {params: {token: token}})
      socket.connect()
      store.dispatch('initializeChat', socket)
    }
  }
}

export default api
