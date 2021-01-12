import filter from 'lodash/filter'

const reports = {
  state: {
    userId: null,
    statuses: [],
    preTickedIds: [],
    modalActivated: false
  },
  mutations: {
    openUserReportingModal (state, { userId, statuses, preTickedIds }) {
      state.userId = userId
      state.statuses = statuses
      state.preTickedIds = preTickedIds
      state.modalActivated = true
    },
    closeUserReportingModal (state) {
      state.modalActivated = false
    }
  },
  actions: {
    openUserReportingModal ({ rootState, commit }, { userId, statusIds = [] }) {
      const preTickedStatuses = statusIds.map(id => rootState.statuses.allStatusesObject[id])
      const preTickedIds = statusIds
      const statuses = preTickedStatuses.concat(
        filter(rootState.statuses.allStatuses,
          status => status.user.id === userId && !preTickedIds.includes(status.id)
        )
      )
      commit('openUserReportingModal', { userId, statuses, preTickedIds })
    },
    closeUserReportingModal ({ commit }) {
      commit('closeUserReportingModal')
    }
  }
}

export default reports
