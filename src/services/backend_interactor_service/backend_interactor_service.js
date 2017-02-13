import apiService from '../api/api.service.js'

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

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    fetchMentions,
    fetchFriends,
    followUser,
    unfollowUser,
    fetchAllFollowing,
    verifyCredentials: apiService.verifyCredentials
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
