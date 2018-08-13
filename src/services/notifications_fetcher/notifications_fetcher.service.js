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
    args['since'] = timelineData.maxId
  }

  args['timeline'] = 'notifications'

  return apiService.fetchTimeline(args)
    .then((notifications) => {
      update({store, notifications, older})
    }, () => store.dispatch('setNotificationsError', { value: true }))
}

const startFetching = ({credentials, store}) => {
  fetchAndUpdate({ credentials, store })
  const boundFetchAndUpdate = () => fetchAndUpdate({ credentials, store })
  return setInterval(boundFetchAndUpdate, 10000)
}

const notificationsFetcher = {
  fetchAndUpdate,
  startFetching
}

export default notificationsFetcher
