import filter from 'lodash/filter'

const reports = {
  state: {
    userId: null,
    statuses: [],
    modalActivated: false
  },
  mutations: {
    openUserReportingModal (state, { userId, statuses }) {
      state.userId = userId
      state.statuses = statuses
      state.modalActivated = true
    },
    closeUserReportingModal (state) {
      state.modalActivated = false
    }
  },
  actions: {
    openUserReportingModal ({ rootState, commit }, userId) {
      const statuses = filter(rootState.statuses.allStatuses, status => status.user.id === userId)
      commit('openUserReportingModal', { userId, statuses })
    },
    closeUserReportingModal ({ commit }) {
      commit('closeUserReportingModal')
    }
  }
}

export default reports
