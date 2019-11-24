import apiService, { getMastodonSocketURI, handleMastoWS } from '../api/api.service.js'
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

  startUserSocket ({ store, onMessage }) {
    const serv = store.rootState.instance.server.replace('https', 'wss')
    // const serb = 'ws://localhost:8080/'
    const url = serv + getMastodonSocketURI({ credentials, stream: 'user' })
    const socket = new WebSocket(url)
    console.log(socket)
    if (socket) {
      socket.addEventListener('message', (wsEvent) => onMessage(handleMastoWS(wsEvent)))
    } else {
      throw new Error('failed to connect to socket')
    }
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
