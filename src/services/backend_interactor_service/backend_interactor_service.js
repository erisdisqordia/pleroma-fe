import apiService from '../api/api.service.js'

const backendInteractorService = (credentials) => {
  const fetchStatus = ({id}) => {
    return apiService.fetchStatus({id, credentials})
  }

  const fetchConversation = ({id}) => {
    return apiService.fetchConversation({id, credentials})
  }

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    verifyCredentials: apiService.verifyCredentials
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
