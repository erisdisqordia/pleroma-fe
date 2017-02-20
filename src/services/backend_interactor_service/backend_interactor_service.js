import apiService from '../api/api.service.js'
import timelineFetcherService from '../timeline_fetcher/timeline_fetcher.service.js'

const backendInteractorService = (credentials) => {
  const fetchStatus = ({id}) => {
    return apiService.fetchStatus({id, credentials})
  }

  const fetchConversation = ({id}) => {
    return apiService.fetchConversation({id, credentials})
  }

  const fetchMentions = ({sinceId, username}) => {
    return apiService.fetchMentions({sinceId, username, credentials})
  }

  const fetchFriends = () => {
    return apiService.fetchFriends({credentials})
  }

  const fetchAllFollowing = ({username}) => {
    return apiService.fetchAllFollowing({username, credentials})
  }

  const followUser = (id) => {
    return apiService.followUser({credentials, id})
  }

  const unfollowUser = (id) => {
    return apiService.unfollowUser({credentials, id})
  }

  const startFetching = ({timeline, store}) => {
    return timelineFetcherService.startFetching({timeline, store, credentials})
  }

  const setUserMute = ({id, muted = true}) => {
    return apiService.setUserMute({id, muted, credentials})
  }

  const fetchMutes = () => apiService.fetchMutes({credentials})

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    fetchMentions,
    fetchFriends,
    followUser,
    unfollowUser,
    fetchAllFollowing,
    verifyCredentials: apiService.verifyCredentials,
    startFetching,
    setUserMute,
    fetchMutes
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
