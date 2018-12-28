import { includes, remove, slice, sortBy, toInteger, each, find, flatten, maxBy, minBy, merge, last, isArray } from 'lodash'
import apiService from '../services/api/api.service.js'
// import parse from '../services/status_parser/status_parser.js'

const emptyTl = () => ({
  statuses: [],
  statusesObject: {},
  faves: [],
  visibleStatuses: [],
  visibleStatusesObject: {},
  newStatusCount: 0,
  maxId: 0,
  minVisibleId: 0,
  loading: false,
  followers: [],
  friends: [],
  userId: 0,
  flushMarker: 0
})

export const defaultState = {
  allStatuses: [],
  allStatusesObject: {},
  maxId: 0,
  notifications: {
    desktopNotificationSilence: true,
    maxId: 0,
    minId: Number.POSITIVE_INFINITY,
    data: [],
    idStore: {},
    error: false
  },
  favorites: new Set(),
  error: false,
  timelines: {
    mentions: emptyTl(),
    public: emptyTl(),
    user: emptyTl(),
    publicAndExternal: emptyTl(),
    friends: emptyTl(),
    tag: emptyTl(),
    dms: emptyTl()
  }
}

const isNsfw = (status) => {
  const nsfwRegex = /#nsfw/i
  return includes(status.tags, 'nsfw') || !!status.text.match(nsfwRegex)
}

export const prepareStatus = (status) => {
  // Parse nsfw tags
  if (status.nsfw === undefined) {
    status.nsfw = isNsfw(status)
    if (status.retweeted_status) {
      status.nsfw = status.retweeted_status.nsfw
    }
  }

  // Set deleted flag
  status.deleted = false

  // To make the array reactive
  status.attachments = status.attachments || []

  return status
}

const visibleNotificationTypes = (rootState) => {
  return [
    rootState.config.notificationVisibility.likes && 'like',
    rootState.config.notificationVisibility.mentions && 'mention',
    rootState.config.notificationVisibility.repeats && 'repeat',
    rootState.config.notificationVisibility.follows && 'follow'
  ].filter(_ => _)
}

export const statusType = (status) => {
  if (status.is_post_verb) {
    return 'status'
  }

  if (status.retweeted_status) {
    return 'retweet'
  }

  if ((typeof status.uri === 'string' && status.uri.match(/(fave|objectType=Favourite)/)) ||
      (typeof status.text === 'string' && status.text.match(/favorited/))) {
    return 'favorite'
  }

  if (status.text.match(/deleted notice {{tag/) || status.qvitter_delete_notice) {
    return 'deletion'
  }

  if (status.text.match(/started following/) || status.activity_type === 'follow') {
    return 'follow'
  }

  return 'unknown'
}

export const findMaxId = (...args) => {
  return (maxBy(flatten(args), 'id') || {}).id
}

const mergeOrAdd = (arr, obj, item) => {
  const oldItem = obj[item.id]

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
    obj[item.id] = item
    return {item, new: true}
  }
}

const sortTimeline = (timeline) => {
  timeline.visibleStatuses = sortBy(timeline.visibleStatuses, ({id}) => -id)
  timeline.statuses = sortBy(timeline.statuses, ({id}) => -id)
  timeline.minVisibleId = (last(timeline.visibleStatuses) || {}).id
  return timeline
}

const addNewStatuses = (state, { statuses, showImmediately = false, timeline, user = {}, noIdUpdate = false, userId }) => {
  // Sanity check
  if (!isArray(statuses)) {
    return false
  }

  const allStatuses = state.allStatuses
  const allStatusesObject = state.allStatusesObject
  const timelineObject = state.timelines[timeline]

  const maxNew = statuses.length > 0 ? maxBy(statuses, 'id').id : 0
  const older = timeline && maxNew < timelineObject.maxId

  if (timeline && !noIdUpdate && statuses.length > 0 && !older) {
    timelineObject.maxId = maxNew
  }

  // This makes sure that user timeline won't get data meant for other
  // user. I.e. opening different user profiles makes request which could
  // return data late after user already viewing different user profile
  if (timeline === 'user' && timelineObject.userId !== userId) {
    return
  }

  const addStatus = (status, showImmediately, addToTimeline = true) => {
    const result = mergeOrAdd(allStatuses, allStatusesObject, status)
    status = result.item

    if (result.new) {
      // We are mentioned in a post
      if (statusType(status) === 'status' && find(status.attentions, { id: user.id })) {
        const mentions = state.timelines.mentions

        // Add the mention to the mentions timeline
        if (timelineObject !== mentions) {
          mergeOrAdd(mentions.statuses, mentions.statusesObject, status)
          mentions.newStatusCount += 1

          sortTimeline(mentions)
        }
      }
      if (status.visibility === 'direct') {
        const dms = state.timelines.dms

        mergeOrAdd(dms.statuses, dms.statusesObject, status)
        dms.newStatusCount += 1

        sortTimeline(dms)
      }
    }

    // Decide if we should treat the status as new for this timeline.
    let resultForCurrentTimeline
    // Some statuses should only be added to the global status repository.
    if (timeline && addToTimeline) {
      resultForCurrentTimeline = mergeOrAdd(timelineObject.statuses, timelineObject.statusesObject, status)
    }

    if (timeline && showImmediately) {
      // Add it directly to the visibleStatuses, don't change
      // newStatusCount
      mergeOrAdd(timelineObject.visibleStatuses, timelineObject.visibleStatusesObject, status)
    } else if (timeline && addToTimeline && resultForCurrentTimeline.new) {
      // Just change newStatuscount
      timelineObject.newStatusCount += 1
    }

    return status
  }

  const favoriteStatus = (favorite, counter) => {
    const status = find(allStatuses, { id: toInteger(favorite.in_reply_to_status_id) })
    if (status) {
      // This is our favorite, so the relevant bit.
      if (favorite.user.id === user.id) {
        status.favorited = true
      } else {
        status.fave_num += 1
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
      if (timeline && find(timelineObject.statuses, (s) => {
        if (s.retweeted_status) {
          return s.id === retweetedStatus.id || s.retweeted_status.id === retweetedStatus.id
        } else {
          return s.id === retweetedStatus.id
        }
      })) {
        // Already have it visible (either as the original or another RT), don't add to timeline, don't show.
        retweet = addStatus(status, false, false)
      } else {
        retweet = addStatus(status, showImmediately)
      }

      retweet.retweeted_status = retweetedStatus
    },
    'favorite': (favorite) => {
      // Only update if this is a new favorite.
      // Ignore our own favorites because we get info about likes as response to like request
      if (!state.favorites.has(favorite.id)) {
        state.favorites.add(favorite.id)
        favoriteStatus(favorite)
      }
    },
    'deletion': (deletion) => {
      const uri = deletion.uri

      // Remove possible notification
      const status = find(allStatuses, {uri})
      if (!status) {
        return
      }

      remove(state.notifications.data, ({action: {id}}) => id === status.id)

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
    if ((older || timelineObject.minVisibleId <= 0) && statuses.length > 0) {
      timelineObject.minVisibleId = minBy(statuses, 'id').id
    }
  }
}

const addNewNotifications = (state, { dispatch, notifications, older, visibleNotificationTypes }) => {
  const allStatuses = state.allStatuses
  const allStatusesObject = state.allStatusesObject
  each(notifications, (notification) => {
    const result = mergeOrAdd(allStatuses, allStatusesObject, notification.notice)
    const action = result.item
    // Only add a new notification if we don't have one for the same action
    if (!find(state.notifications.data, (oldNotification) => oldNotification.action.id === action.id)) {
      state.notifications.maxId = Math.max(notification.id, state.notifications.maxId)
      state.notifications.minId = Math.min(notification.id, state.notifications.minId)

      const fresh = !notification.is_seen
      const status = notification.ntype === 'like'
            ? action.favorited_status
            : action

      const result = {
        type: notification.ntype,
        status,
        action,
        seen: !fresh
      }

      state.notifications.data.push(result)
      state.notifications.idStore[notification.id] = result

      if ('Notification' in window && window.Notification.permission === 'granted') {
        const title = action.user.name
        const result = {}
        result.icon = action.user.profile_image_url
        result.body = action.text // there's a problem that it doesn't put a space before links tho

        // Shows first attached non-nsfw image, if any. Should add configuration for this somehow...
        if (action.attachments && action.attachments.length > 0 && !action.nsfw &&
            action.attachments[0].mimetype.startsWith('image/')) {
          result.image = action.attachments[0].url
        }

        if (fresh && !state.notifications.desktopNotificationSilence && visibleNotificationTypes.includes(notification.ntype)) {
          let notification = new window.Notification(title, result)
          // Chrome is known for not closing notifications automatically
          // according to MDN, anyway.
          setTimeout(notification.close.bind(notification), 5000)
        }
      }
    }
  })
}

export const mutations = {
  addNewStatuses,
  addNewNotifications,
  showNewStatuses (state, { timeline }) {
    const oldTimeline = (state.timelines[timeline])

    oldTimeline.newStatusCount = 0
    oldTimeline.visibleStatuses = slice(oldTimeline.statuses, 0, 50)
    oldTimeline.minVisibleId = last(oldTimeline.visibleStatuses).id
    oldTimeline.visibleStatusesObject = {}
    each(oldTimeline.visibleStatuses, (status) => { oldTimeline.visibleStatusesObject[status.id] = status })
  },
  clearTimeline (state, { timeline }) {
    state.timelines[timeline] = emptyTl()
  },
  setFavorited (state, { status, value }) {
    const newStatus = state.allStatusesObject[status.id]
    newStatus.favorited = value
  },
  setFavoritedConfirm (state, { status }) {
    const newStatus = state.allStatusesObject[status.id]
    newStatus.favorited = status.favorited
    newStatus.fave_num = status.fave_num
  },
  setRetweeted (state, { status, value }) {
    const newStatus = state.allStatusesObject[status.id]
    newStatus.repeated = value
  },
  setDeleted (state, { status }) {
    const newStatus = state.allStatusesObject[status.id]
    newStatus.deleted = true
  },
  setLoading (state, { timeline, value }) {
    state.timelines[timeline].loading = value
  },
  setNsfw (state, { id, nsfw }) {
    const newStatus = state.allStatusesObject[id]
    newStatus.nsfw = nsfw
  },
  setError (state, { value }) {
    state.error = value
  },
  setNotificationsError (state, { value }) {
    state.notifications.error = value
  },
  setNotificationsSilence (state, { value }) {
    state.notifications.desktopNotificationSilence = value
  },
  markNotificationsAsSeen (state) {
    each(state.notifications.data, (notification) => {
      notification.seen = true
    })
  },
  queueFlush (state, { timeline, id }) {
    state.timelines[timeline].flushMarker = id
  }
}

const statuses = {
  state: defaultState,
  actions: {
    addNewStatuses ({ rootState, commit }, { statuses, showImmediately = false, timeline = false, noIdUpdate = false, userId }) {
      commit('addNewStatuses', { statuses, showImmediately, timeline, noIdUpdate, user: rootState.users.currentUser, userId })
    },
    addNewNotifications ({ rootState, commit, dispatch }, { notifications, older }) {
      commit('addNewNotifications', { visibleNotificationTypes: visibleNotificationTypes(rootState), dispatch, notifications, older })
    },
    setError ({ rootState, commit }, { value }) {
      commit('setError', { value })
    },
    setNotificationsError ({ rootState, commit }, { value }) {
      commit('setNotificationsError', { value })
    },
    setNotificationsSilence ({ rootState, commit }, { value }) {
      commit('setNotificationsSilence', { value })
    },
    deleteStatus ({ rootState, commit }, status) {
      commit('setDeleted', { status })
      apiService.deleteStatus({ id: status.id, credentials: rootState.users.currentUser.credentials })
    },
    favorite ({ rootState, commit }, status) {
      // Optimistic favoriting...
      commit('setFavorited', { status, value: true })
      apiService.favorite({ id: status.id, credentials: rootState.users.currentUser.credentials })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            return {}
          }
        })
        .then(status => {
          commit('setFavoritedConfirm', { status })
        })
    },
    unfavorite ({ rootState, commit }, status) {
      // Optimistic favoriting...
      commit('setFavorited', { status, value: false })
      apiService.unfavorite({ id: status.id, credentials: rootState.users.currentUser.credentials })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            return {}
          }
        })
        .then(status => {
          commit('setFavoritedConfirm', { status })
        })
    },
    retweet ({ rootState, commit }, status) {
      // Optimistic retweeting...
      commit('setRetweeted', { status, value: true })
      apiService.retweet({ id: status.id, credentials: rootState.users.currentUser.credentials })
    },
    unretweet ({ rootState, commit }, status) {
      commit('setRetweeted', { status, value: false })
      apiService.unretweet({ id: status.id, credentials: rootState.users.currentUser.credentials })
    },
    queueFlush ({ rootState, commit }, { timeline, id }) {
      commit('queueFlush', { timeline, id })
    },
    markNotificationsAsSeen ({ rootState, commit }) {
      commit('markNotificationsAsSeen')
      apiService.markNotificationsAsSeen({
        id: rootState.statuses.notifications.maxId,
        credentials: rootState.users.currentUser.credentials
      })
    }
  },
  mutations
}

export default statuses
