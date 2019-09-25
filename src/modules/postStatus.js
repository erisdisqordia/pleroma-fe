const postStatus = {
  state: {
    params: null,
    modalActivated: false
  },
  mutations: {
    openPostStatusModal (state, params) {
      state.params = params
      state.modalActivated = true
    },
    closePostStatusModal (state) {
      state.modalActivated = false
    }
  },
  actions: {
    openPostStatusModal ({ commit }, params) {
      commit('openPostStatusModal', params)
    },
    closePostStatusModal ({ commit }) {
      commit('closePostStatusModal')
    }
  }
}

export default postStatus
