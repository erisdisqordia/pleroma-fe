import apiService from '../api/api.service.js'

const update = ({ store, notifications, older }) => {
  store.dispatch('setNotificationsError', { value: false })
  store.dispatch('addNewNotifications', { notifications, older })
}

const fetchAndUpdate = ({ store, credentials, older = false }) => {
  const args = { credentials }
  const { getters } = store
  const rootState = store.rootState || store.state
  const timelineData = rootState.statuses.notifications
  const hideMutedPosts = getters.mergedConfig.hideMutedPosts

  args['withMuted'] = !hideMutedPosts

  args['timeline'] = 'notifications'
  if (older) {
    if (timelineData.minId !== Number.POSITIVE_INFINITY) {
      args['until'] = timelineData.minId
    }
    return fetchNotifications({ store, args, older })
  } else {
    // fetch new notifications
    if (timelineData.maxId !== Number.POSITIVE_INFINITY) {
      args['since'] = timelineData.maxId
    }
    const result = fetchNotifications({ store, args, older })

    // If there's any unread notifications, try fetch notifications since
    // the newest read notification to check if any of the unread notifs
    // have changed their 'seen' state (marked as read in another session), so
    // we can update the state in this session to mark them as read as well.
    // The normal maxId-check does not tell if older notifications have changed
    const notifications = timelineData.data
    const readNotifsIds = notifications.filter(n => n.seen).map(n => n.id)
    const numUnseenNotifs = notifications.length - readNotifsIds.length
    if (numUnseenNotifs > 0 && readNotifsIds.length > 0) {
      args['since'] = Math.max(...readNotifsIds)
      fetchNotifications({ store, args, older })
    }
    return result
  }
}

const fetchNotifications = ({ store, args, older }) => {
  return apiService.fetchTimeline(args)
    .then(({ data: notifications }) => {
      update({ store, notifications, older })
      return notifications
    }, () => store.dispatch('setNotificationsError', { value: true }))
    .catch(() => store.dispatch('setNotificationsError', { value: true }))
}

const startFetching = ({ credentials, store }) => {
  fetchAndUpdate({ credentials, store })
  const boundFetchAndUpdate = () => fetchAndUpdate({ credentials, store })
  // Initially there's set flag to silence all desktop notifications so
  // that there won't spam of them when user just opened up the FE we
  // reset that flag after a while to show new notifications once again.
  setTimeout(() => store.dispatch('setNotificationsSilence', false), 10000)
  return setInterval(boundFetchAndUpdate, 10000)
}

const notificationsFetcher = {
  fetchAndUpdate,
  startFetching
}

export default notificationsFetcher
