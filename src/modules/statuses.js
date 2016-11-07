import { map, slice, last, intersectionBy, sortBy, unionBy, toInteger, groupBy, differenceBy, each, find } from 'lodash'
import moment from 'moment'
import apiService from '../services/api/api.service.js'

export const defaultState = {
  allStatuses: [],
  maxId: 0,
  timelines: {
    public: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0,
      loading: false
    },
    publicAndExternal: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0,
      loading: false
    },
    friends: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0,
      loading: false
    }
  }
}

const statusType = (status) => {
  return !status.is_post_verb && status.uri.match(/fave/) ? 'fave' : 'status'
}

const addStatusesToTimeline = (addedStatuses, showImmediately, { statuses, visibleStatuses, newStatusCount, faves, loading }) => {
  const statusesAndFaves = groupBy(addedStatuses, statusType)
  const addedFaves = statusesAndFaves['fave'] || []
  const unseenFaves = differenceBy(addedFaves, faves, 'id')

  // Update fave count
  each(unseenFaves, ({in_reply_to_status_id}) => {
    const status = find(statuses, { id: toInteger(in_reply_to_status_id) })
    if (status) {
      status.fave_num += 1
    }
  })

  addedStatuses = statusesAndFaves['status'] || []

  // Add some html and nsfw to the statuses.
  each(addedStatuses, (status) => {
    const statusoid = status.retweeted_status || status

    statusoid.created_at_parsed = statusoid.created_at

    if (statusoid.parsedText === undefined) {
     // statusoid.parsedText =  statusParserService.parse(statusoid)
      statusoid.parsedText = statusoid.text
    }

    if (statusoid.nsfw === undefined) {
      const nsfwRegex = /#nsfw/i
      statusoid.nsfw = statusoid.text.match(nsfwRegex)
    }
  })

  const newStatuses = sortBy(
    unionBy(addedStatuses, statuses, 'id'),
    ({id}) => -id
  )

  let newNewStatusCount = newStatusCount + (newStatuses.length - statuses.length)

  let newVisibleStatuses = visibleStatuses

  if (showImmediately) {
    newVisibleStatuses = unionBy(addedStatuses, newVisibleStatuses, 'id')
    newVisibleStatuses = sortBy(newVisibleStatuses, ({id}) => -id)
    newNewStatusCount = newStatusCount
  };

  newVisibleStatuses = intersectionBy(newStatuses, newVisibleStatuses, 'id')

  return {
    statuses: newStatuses,
    visibleStatuses: newVisibleStatuses,
    newStatusCount: newNewStatusCount,
    maxId: newStatuses[0].id,
    minVisibleId: (last(newVisibleStatuses) || { id: undefined }).id,
    faves: unionBy(faves, addedFaves, 'id'),
    loading
  }
}

const updateTimestampsInStatuses = (statuses) => {
  return map(statuses, (statusoid) => {
    const status = statusoid.retweeted_status || statusoid

    // Parse date
    status.created_at_parsed = moment(status.created_at).fromNow()
    return status
  })
}

export const mutations = {
  addNewStatuses (state, { statuses, showImmediately = false, timeline }) {
    state.timelines[timeline] = addStatusesToTimeline(statuses, showImmediately, state.timelines[timeline])
    state.allStatuses = unionBy(state.timelines[timeline].statuses, state.allStatuses.id)
  },
  showNewStatuses (state, { timeline }) {
    const oldTimeline = (state.timelines[timeline])

    oldTimeline.newStatusCount = 0
    oldTimeline.visibleStatuses = slice(oldTimeline.statuses, 0, 50)
  },
  updateTimestamps (state) {
    updateTimestampsInStatuses(state.allStatuses)
  },
  setFavorited (state, { status, value }) {
    const newStatus = find(state.allStatuses, status)
    newStatus.favorited = value
  },
  setLoading (state, { timeline, value }) {
    state.timelines[timeline].loading = value
  },
  setNsfw (state, { id, nsfw }) {
    // For now, walk through all the statuses because the stuff might be in the replied_to_status
    // TODO: Save the replied_tos as references.
    each(state.allStatuses, (statusoid) => {
      const status = statusoid.retweeted_status || statusoid
      if (status.id === id) {
        status.nsfw = nsfw
      }
    })
  }
}

const statuses = {
  state: defaultState,
  actions: {
    favorite ({ rootState, commit }, status) {
      // Optimistic favoriting...
      commit('setFavorited', { status, value: true })
      apiService.favorite({ id: status.id, credentials: rootState.users.currentUser.credentials })
    },
    unfavorite ({ rootState, commit }, status) {
      // Optimistic favoriting...
      commit('setFavorited', { status, value: false })
      apiService.unfavorite({ id: status.id, credentials: rootState.users.currentUser.credentials })
    }
  },
  mutations
}

export default statuses
