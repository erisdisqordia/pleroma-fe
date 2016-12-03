import { remove, slice, sortBy, toInteger, each, find, flatten, maxBy, last, merge, max, isArray } from 'lodash'
import apiService from '../services/api/api.service.js'
// import parse from '../services/status_parser/status_parser.js'

export const defaultState = {
  allStatuses: [],
  maxId: 0,
  notifications: [],
  favorites: new Set(),
  timelines: {
    mentions: {
      statuses: [],
      faves: [],
      visibleStatuses: [],
      newStatusCount: 0,
      maxId: 0,
      minVisibleId: 0,
      loading: false
    },
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

  // To make the array reactive
  status.attachments = status.attachments || []

  return status
}

export const statusType = (status) => {
  if (status.is_post_verb) {
    return 'status'
  }

  if (status.retweeted_status) {
    return 'retweet'
  }

  if (typeof status.uri === 'string' && status.uri.match(/(fave|objectType=Favourite)/)) {
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
    // Reactivity fix.
    oldItem.attachments.splice(oldItem.attachments.length)
    return {item: oldItem, new: false}
  } else {
    // This is a new item, prepare it
    prepareStatus(item)
    arr.push(item)
    return {item, new: true}
  }
}

const sortTimeline = (timeline) => {
  timeline.visibleStatuses = sortBy(timeline.visibleStatuses, ({id}) => -id)
  timeline.statuses = sortBy(timeline.statuses, ({id}) => -id)
  timeline.minVisibleId = (last(timeline.statuses) || {}).id

  return timeline
}

const addNewStatuses = (state, { statuses, showImmediately = false, timeline, user = {}, noIdUpdate = false }) => {
  // Sanity check
  if (!isArray(statuses)) {
    return false
  }

  const allStatuses = state.allStatuses
  const timelineObject = state.timelines[timeline]

  // Set the maxId to the new id if it's larger.
  const updateMaxId = ({id}) => {
    if (!timeline || noIdUpdate) { return false }
    timelineObject.maxId = max([id, timelineObject.maxId])
  }

  const addStatus = (status, showImmediately, addToTimeline = true) => {
    const result = mergeOrAdd(allStatuses, status)
    status = result.item

    if (result.new) {
      updateMaxId(status)

      if (statusType(status) === 'retweet' && status.retweeted_status.user.id === user.id) {
        addNotification({ type: 'repeat', status: status.retweeted_status, action: status })
      }

      // We are mentioned in a post
      if (statusType(status) === 'status' && find(status.attentions, { id: user.id })) {
        const mentions = state.timelines.mentions

        // Add the mention to the mentions timeline
        if (timelineObject !== mentions) {
          mergeOrAdd(mentions.statuses, status)
          mentions.newStatusCount += 1

          sortTimeline(mentions)
        }

        addNotification({ type: 'mention', status, action: status })
      }
    }

    // Some statuses should only be added to the global status repository.
    if (timeline && addToTimeline) {
      mergeOrAdd(timelineObject.statuses, status)
    }

    if (timeline && showImmediately) {
      // Add it directly to the visibleStatuses, don't change
      // newStatusCount
      mergeOrAdd(timelineObject.visibleStatuses, status)
    } else if (timeline && addToTimeline && result.new) {
      // Just change newStatuscount
      timelineObject.newStatusCount += 1
    }

    return status
  }

  const addNotification = ({type, status, action}) => {
    state.notifications.push({type, status, action})
  }

  const favoriteStatus = (favorite) => {
    const status = find(allStatuses, { id: toInteger(favorite.in_reply_to_status_id) })
    if (status) {
      status.fave_num += 1

      // This is our favorite, so the relevant bit.
      if (favorite.user.id === user.id) {
        status.favorited = true
      }

      // Add a notification if the user's status is favorited
      if (status.user.id === user.id) {
        addNotification({type: 'favorite', status, action: favorite})
      }
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
      if (timeline && find(timelineObject.visibleStatuses, {id: retweetedStatus.id})) {
        // Already have it visible, don't add to timeline, don't show.
        retweet = addStatus(status, false, false)
      } else {
        retweet = addStatus(status, showImmediately)
      }

      retweet.retweeted_status = retweetedStatus
    },
    'favorite': (favorite) => {
      // Only update if this is a new favorite.
      if (!state.favorites.has(favorite.id)) {
        state.favorites.add(favorite.id)
        updateMaxId(favorite)
        favoriteStatus(favorite)
      }
    },
    'deletion': (deletion) => {
      const uri = deletion.uri
      updateMaxId(deletion)

      remove(allStatuses, { uri })
      if (timeline) {
        remove(timelineObject.statuses, { uri })
        remove(timelineObject.visibleStatuses, { uri })
      }
    },
    'default': (unknown) => {
      console.log('unknown status type')
      console.log(unknown)
    }
  }

  each(statuses, (status) => {
    const type = statusType(status)
    const processor = processors[type] || processors['default']
    processor(status)
  })

  // Keep the visible statuses sorted
  if (timeline) {
    sortTimeline(timelineObject)
  }
}

export const mutations = {
  addNewStatuses,
  showNewStatuses (state, { timeline }) {
    const oldTimeline = (state.timelines[timeline])

    oldTimeline.newStatusCount = 0
    oldTimeline.visibleStatuses = slice(oldTimeline.statuses, 0, 50)
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
    addNewStatuses ({ rootState, commit }, { statuses, showImmediately = false, timeline = false, noIdUpdate = false }) {
      commit('addNewStatuses', { statuses, showImmediately, timeline, noIdUpdate, user: rootState.users.currentUser })
    },
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
