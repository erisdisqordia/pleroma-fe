import { remove, slice, each, find, maxBy, minBy, merge, last, isArray } from 'lodash'
import apiService from '../services/api/api.service.js'
// import parse from '../services/status_parser/status_parser.js'

const emptyTl = (userId = 0) => ({
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
  userId,
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
    loading: false,
    error: false
  },
  favorites: new Set(),
  error: false,
  timelines: {
    mentions: emptyTl(),
    public: emptyTl(),
    user: emptyTl(),
    favorites: emptyTl(),
    media: emptyTl(),
    publicAndExternal: emptyTl(),
    friends: emptyTl(),
    tag: emptyTl(),
    dms: emptyTl()
  }
}

export const prepareStatus = (status) => {
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

const sortById = (a, b) => {
  const seqA = Number(a.id)
  const seqB = Number(b.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA > seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return 1
  } else if (!isSeqA && isSeqB) {
    return -1
  } else {
    return a.id > b.id ? -1 : 1
  }
}

const sortTimeline = (timeline) => {
  timeline.visibleStatuses = timeline.visibleStatuses.sort(sortById)
  timeline.statuses = timeline.statuses.sort(sortById)
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

  const addStatus = (data, showImmediately, addToTimeline = true) => {
    const result = mergeOrAdd(allStatuses, allStatusesObject, data)
    const status = result.item

    if (result.new) {
      // We are mentioned in a post
      if (status.type === 'status' && find(status.attentions, { id: user.id })) {
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
    const status = find(allStatuses, { id: favorite.in_reply_to_status_id })
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
    'follow': (follow) => {
      // NOOP, it is known status but we don't do anything about it for now
    },
    'default': (unknown) => {
      console.log('unknown status type')
      console.log(unknown)
    }
  }

  each(statuses, (status) => {
    const type = status.type
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
    notification.action = mergeOrAdd(allStatuses, allStatusesObject, notification.action).item
    notification.status = notification.status && mergeOrAdd(allStatuses, allStatusesObject, notification.status).item

    // Only add a new notification if we don't have one for the same action
    if (!state.notifications.idStore.hasOwnProperty(notification.id)) {
      state.notifications.maxId = notification.id > state.notifications.maxId
        ? notification.id
        : state.notifications.maxId
      state.notifications.minId = notification.id < state.notifications.minId
        ? notification.id
        : state.notifications.minId

      state.notifications.data.push(notification)
      state.notifications.idStore[notification.id] = notification

      if ('Notification' in window && window.Notification.permission === 'granted') {
        const notifObj = {}
        const action = notification.action
        const title = action.user.name
        notifObj.icon = action.user.profile_image_url
        notifObj.body = action.text // there's a problem that it doesn't put a space before links tho

        // Shows first attached non-nsfw image, if any. Should add configuration for this somehow...
        if (action.attachments && action.attachments.length > 0 && !action.nsfw &&
            action.attachments[0].mimetype.startsWith('image/')) {
          notifObj.image = action.attachments[0].url
        }

        if (notification.fresh && !state.notifications.desktopNotificationSilence && visibleNotificationTypes.includes(notification.ntype)) {
          let notification = new window.Notification(title, notifObj)
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
    state.timelines[timeline] = emptyTl(state.timelines[timeline].userId)
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
  setNotificationsLoading (state, { value }) {
    state.notifications.loading = value
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
    setNotificationsLoading ({ rootState, commit }, { value }) {
      commit('setNotificationsLoading', { value })
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
