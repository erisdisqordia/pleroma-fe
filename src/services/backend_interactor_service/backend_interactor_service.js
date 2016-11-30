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

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    fetchMentions,
    fetchFriends,
    verifyCredentials: apiService.verifyCredentials
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
