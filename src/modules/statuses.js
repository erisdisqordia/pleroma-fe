import { reduce, map, slice, last, intersectionBy, sortBy, unionBy, toInteger, groupBy, differenceBy, each, find, flatten, maxBy, merge } from 'lodash'
import moment from 'moment'
import apiService from '../services/api/api.service.js'
// import parse from '../services/status_parser/status_parser.js'

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

export const prepareStatus = (status) => {
  // Parse nsfw tags
  if (status.nsfw === undefined) {
    const nsfwRegex = /#nsfw/i
    status.nsfw = !!status.text.match(nsfwRegex)
  }

  // Set created_at_parsed to initial value
  status.created_at_parsed = status.created_at

  return status
}

// Merges old and new status collections.
const mergeStatuses = (oldStatuses, newStatuses) => {
  each(newStatuses, (status) => {
    let oldStatus = find(oldStatuses, { id: status.id })
    if (oldStatus) {
      merge(oldStatus, status)
    } else {
      oldStatuses.push(status)
    }
  })
  return oldStatuses
}

const addStatusesToTimeline = (addedStatuses, showImmediately, { statuses, visibleStatuses, newStatusCount, faves, loading, maxId }) => {
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
  addedStatuses = map(addedStatuses, (status) => {
    const statusoid = status.retweeted_status || status

    prepareStatus(statusoid)

    return status
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
    minVisibleId: (last(newVisibleStatuses) || { id: undefined }).id,
    faves: unionBy(faves, addedFaves, 'id'),
    maxId,
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

// const groupStatusesByType = (statuses) => {
//   return groupBy(statuses, (status) => {
//     if (status.is_post_verb) {
//       return 'status'
//     }

//     if (status.retweeted_status) {
//       return 'retweet'
//     }

//     if (typeof status.uri === 'string' && status.uri.match(/fave/)) {
//       return 'favorite'
//     }

//     return 'unknown'
//   })
// }

export const findMaxId = (...args) => {
  return (maxBy(flatten(args), 'id') || {}).id
}

export const mutations = {
  addNewStatuses (state, { statuses, showImmediately = false, timeline }) {
    const timelineObject = state.timelines[timeline]

    // Set new maxId
    const maxId = findMaxId(statuses, timelineObject.statuses)
    timelineObject.maxId = maxId

    // Split statuses by type
    // const statusesByType = groupStatusesByType(statuses)

    state.timelines[timeline] = addStatusesToTimeline(statuses, showImmediately, state.timelines[timeline])
    mergeStatuses(state.allStatuses, state.timelines[timeline].statuses)

    // Set up retweets with most current status
    const getRetweets = (result, status) => {
      if (status.retweeted_status) {
        result.push(status.retweeted_status)
      }
      return result
    }

    const retweets = reduce(statuses, getRetweets, [])

    state.allStatuses = unionBy(retweets, state.allStatuses, 'id')

    each(state.allStatuses, (status) => {
      if (status.retweeted_status) {
        const retweetedStatus = find(state.allStatuses, { id: status.retweeted_status.id })
        status.retweeted_status = retweetedStatus
      }
    })
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
  setRetweeted (state, { status, value }) {
    const newStatus = find(state.allStatuses, status)
    newStatus.repeated = value
  },
  setLoading (state, { timeline, value }) {
    state.timelines[timeline].loading = value
  },
  setNsfw (state, { id, nsfw }) {
    const newStatus = find(state.allStatuses, { id })
    newStatus.nsfw = nsfw
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
    },
    retweet ({ rootState, commit }, status) {
      // Optimistic retweeting...
      commit('setRetweeted', { status, value: true })
      apiService.retweet({ id: status.id, credentials: rootState.users.currentUser.credentials })
    }
  },
  mutations
}

export default statuses
