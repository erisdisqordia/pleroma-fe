import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'

const api = {
  state: {
    backendInteractor: backendInteractorService(),
    fetchers: {}
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
    }
  },
  actions: {
    startFetching (store, timeline) {
      // Don't start fetching if we already are.
      if (!store.state.fetchers[timeline]) {
        const fetcher = store.state.backendInteractor.startFetching({timeline, store})
        store.commit('addFetcher', {timeline, fetcher})
      }
    },
    stopFetching (store, timeline) {
      const fetcher = store.state.fetchers[timeline]
      window.clearInterval(fetcher)
      store.commit('removeFetcher', {timeline})
    }
  }
}

export default api
