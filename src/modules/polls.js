import { each, merge } from 'lodash'
import { set } from 'vue'

const polls = {
  state: {
    // Contains key = id, value = number of trackers for this poll
    trackedPolls: {},
    pollsObject: {}
  },
  mutations: {
    addNewStatuses (state, { statuses }) {
      each(statuses, status => {
        if (status.poll) {
          set(state.pollsObject, status.poll.id, status.poll)
        }
      })
    },
    mergePoll (state, poll) {
      state.pollsObject[poll.id] = merge(state.pollsObject[poll.id], poll)
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
    updatePoll ({ rootState, commit }, pollId) {
      return rootState.api.backendInteractor.fetchPoll(pollId).then(poll => {
        commit('mergePoll', poll)
        return poll
      })
    },
    updateTrackedPoll ({ rootState, dispatch, commit }, pollId) {
      rootState.api.backendInteractor.fetchPoll(pollId).then(poll => {
        setTimeout(() => {
          if (rootState.polls.trackedPolls[pollId]) {
            dispatch('updateTrackedPoll', pollId)
          }
        }, 30 * 1000)
        commit('mergePoll', poll)
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
      return rootState.api.backendInteractor.vote(pollId, choices).then(poll => {
        commit('mergePoll', poll)
        return poll
      })
    }
  }
}

export default polls
