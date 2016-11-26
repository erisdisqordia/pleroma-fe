import backendInteractorService from '../services/backend_interactor_service/backend_interactor_service.js'

const api = {
  state: {
    backendInteractor: backendInteractorService()
  },
  mutations: {
    setBackendInteractor (state, backendInteractor) {
      state.backendInteractor = backendInteractor
    }
  }
}

export default api
