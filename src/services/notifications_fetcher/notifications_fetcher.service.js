import apiService from '../api/api.service.js'

const update = ({store, notifications, older}) => {
  store.dispatch('setNotificationsError', { value: false })

  store.dispatch('addNewNotifications', { notifications, older })
}

const fetchAndUpdate = ({store, credentials, older = false}) => {
  const args = { credentials }
  const rootState = store.rootState || store.state
  const timelineData = rootState.statuses.notifications

  if (older) {
    if (timelineData.minId !== Number.POSITIVE_INFINITY) {
      args['until'] = timelineData.minId
    }
  } else {
    // load unread notifications repeadedly to provide consistency between browser tabs
    const notifications = timelineData.data
    const unread = notifications.filter(n => !n.seen).map(n => n.id)
    if (!unread.length) {
      args['since'] = timelineData.maxId
    } else {
      args['since'] = Math.min(...unread) - 1
      if (timelineData.maxId !== Math.max(...unread)) {
        args['until'] = Math.max(...unread, args['since'] + 20)
      }
    }
  }

  args['timeline'] = 'notifications'

  return apiService.fetchTimeline(args)
    .then((notifications) => {
      update({store, notifications, older})
      return notifications
    }, () => store.dispatch('setNotificationsError', { value: true }))
    .catch(() => store.dispatch('setNotificationsError', { value: true }))
}

const startFetching = ({credentials, store}) => {
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
