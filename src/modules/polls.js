import { merge } from 'lodash'
import { set } from 'vue'

const polls = {
  state: {
    // Contains key = id, value = number of trackers for this poll
    trackedPolls: {},
    pollsObject: {}
  },
  mutations: {
    mergeOrAddPoll (state, poll) {
      const existingPoll = state.pollsObject[poll.id]
      // Make expired-state change trigger re-renders properly
      poll.expired = Date.now() > Date.parse(poll.expires_at)
      if (existingPoll) {
        set(state.pollsObject, poll.id, merge(existingPoll, poll))
      } else {
        set(state.pollsObject, poll.id, poll)
      }
    },
    trackPoll (state, pollId) {
      const currentValue = state.trackedPolls[pollId]
      if (currentValue) {
        set(state.trackedPolls, pollId, currentValue + 1)
      } else {
        set(state.trackedPolls, pollId, 1)
      }
    },
    untrackPoll (state, pollId) {
      const currentValue = state.trackedPolls[pollId]
      if (currentValue) {
        set(state.trackedPolls, pollId, currentValue - 1)
      } else {
        set(state.trackedPolls, pollId, 0)
      }
    }
  },
  actions: {
    mergeOrAddPoll ({ commit }, poll) {
      commit('mergeOrAddPoll', poll)
    },
    updateTrackedPoll ({ rootState, dispatch, commit }, pollId) {
      rootState.api.backendInteractor.fetchPoll({ pollId }).then(poll => {
        setTimeout(() => {
          if (rootState.polls.trackedPolls[pollId]) {
            dispatch('updateTrackedPoll', pollId)
          }
        }, 30 * 1000)
        commit('mergeOrAddPoll', poll)
      })
    },
    trackPoll ({ rootState, commit, dispatch }, pollId) {
      if (!rootState.polls.trackedPolls[pollId]) {
        setTimeout(() => dispatch('updateTrackedPoll', pollId), 30 * 1000)
      }
      commit('trackPoll', pollId)
    },
    untrackPoll ({ commit }, pollId) {
      commit('untrackPoll', pollId)
    },
    votePoll ({ rootState, commit }, { id, pollId, choices }) {
      return rootState.api.backendInteractor.vote({ pollId, choices }).then(poll => {
        commit('mergeOrAddPoll', poll)
        return poll
      })
    }
  }
}

export default polls
