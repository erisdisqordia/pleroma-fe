import apiService from '../api/api.service.js'
import timelineFetcherService from '../timeline_fetcher/timeline_fetcher.service.js'
import notificationsFetcher from '../notifications_fetcher/notifications_fetcher.service.js'
import followRequestFetcher from '../../services/follow_request_fetcher/follow_request_fetcher.service'

const backendInteractorService = credentials => ({
  startFetchingTimeline ({ timeline, store, userId = false, tag }) {
    return timelineFetcherService.startFetching({ timeline, store, credentials, userId, tag })
  },

  startFetchingNotifications ({ store }) {
    return notificationsFetcher.startFetching({ store, credentials })
  },

  startFetchingFollowRequest ({ store }) {
    return followRequestFetcher.startFetching({ store, credentials })
  },

  ...Object.entries(apiService).reduce((acc, [key, func]) => {
    return {
      ...acc,
      [key]: (args) => func({ credentials, ...args })
    }
  }, {}),

  verifyCredentials: apiService.verifyCredentials
})

export default backendInteractorService
