import { remove, map, slice, sortBy, toInteger, each, find, flatten, maxBy, last, merge, max } from 'lodash'
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

const updateTimestampsInStatuses = (statuses) => {
  return map(statuses, (statusoid) => {
    const status = statusoid.retweeted_status || statusoid

    // Parse date
    status.created_at_parsed = moment(status.created_at).fromNow()
    return status
  })
}

const statusType = (status) => {
  if (status.is_post_verb) {
    return 'status'
  }

  if (status.retweeted_status) {
    return 'retweet'
  }

  if (typeof status.uri === 'string' && status.uri.match(/fave/)) {
    return 'favorite'
  }

  if (status.text.match(/deleted notice {{tag/)) {
    return 'deletion'
  }

  return 'unknown'
}

export const findMaxId = (...args) => {
  return (maxBy(flatten(args), 'id') || {}).id
}

const mergeOrAdd = (arr, item) => {
  const oldItem = find(arr, {id: item.id})
  if (oldItem) {
    // We already have this, so only merge the new info.
    merge(oldItem, item)
    return oldItem
  } else {
    // This is a new item, prepare it
    prepareStatus(item)
    arr.push(item)
    return item
  }
}

export const mutations = {
  addNewStatuses (state, { statuses, showImmediately = false, timeline }) {
    const allStatuses = state.allStatuses
    const timelineObject = state.timelines[timeline]

    // Set the maxId to the new id if it's larger.
    const updateMaxId = ({id}) => {
      timelineObject.maxId = max([id, timelineObject.maxId])
    }

    const addStatus = (status, showImmediately, addToTimeline = true) => {
      // Remember the current amount of statuses
      // We need that to calculate new status count.
      const prevLength = timelineObject.statuses.length

      updateMaxId(status)

      status = mergeOrAdd(allStatuses, status)

      // Some statuses should only be added to the global status repository.
      if (addToTimeline) {
        mergeOrAdd(timelineObject.statuses, status)
      }

      if (showImmediately) {
        // Add it directly to the visibleStatuses, don't change
        // newStatusCount
        mergeOrAdd(timelineObject.visibleStatuses, status)
      } else {
        // Just change newStatuscount
        timelineObject.newStatusCount += (timelineObject.statuses.length - prevLength)
      }

      return status
    }

    const favoriteStatus = (favorite) => {
      const status = find(allStatuses, { id: toInteger(favorite.in_reply_to_status_id) })
      if (status) {
        status.fave_num += 1
      }
      return status
    }

    const processors = {
      'status': (status) => {
        addStatus(status, showImmediately)
      },
      'retweet': (status) => {
        // RetweetedStatuses are never shown immediately
        const retweetedStatus = addStatus(status.retweeted_status, false, false)

        let retweet
        // If the retweeted status is already there, don't add the retweet
        // to the timeline.
        if (find(timelineObject.visibleStatuses, {id: retweetedStatus.id})) {
          // Already have it visible, don't add to timeline, don't show.
          retweet = addStatus(status, false, false)
        } else {
          retweet = addStatus(status, showImmediately)
        }

        retweet.retweeted_status = retweetedStatus
      },
      'favorite': (favorite) => {
        updateMaxId(favorite)
        favoriteStatus(favorite)
      },
      'deletion': ({uri}) => {
        remove(allStatuses, { tag: uri })
        remove(timelineObject.statuses, { tag: uri })
        remove(timelineObject.visibleStatuses, { tag: uri })
      },
      'default': (unknown) => {
        console.log(unknown)
      }
    }

    each(statuses, (status) => {
      const type = statusType(status)
      const processor = processors[type] || processors['default']
      processor(status)
    })

    // Keep the visible statuses sorted
    timelineObject.visibleStatuses = sortBy(timelineObject.visibleStatuses, ({id}) => -id)
    timelineObject.statuses = sortBy(timelineObject.statuses, ({id}) => -id)
    timelineObject.minVisibleId = (last(timelineObject.statuses) || {}).id
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
