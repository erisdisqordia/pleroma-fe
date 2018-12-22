import apiService from '../api/api.service.js'
import timelineFetcherService from '../timeline_fetcher/timeline_fetcher.service.js'

const backendInteractorService = (credentials) => {
  const fetchStatus = ({id}) => {
    return apiService.fetchStatus({id, credentials})
  }

  const fetchConversation = ({id}) => {
    return apiService.fetchConversation({id, credentials})
  }

  const fetchFriends = ({id}) => {
    return apiService.fetchFriends({id, credentials})
  }

  const fetchFollowers = ({id}) => {
    return apiService.fetchFollowers({id, credentials})
  }

  const fetchAllFollowing = ({username}) => {
    return apiService.fetchAllFollowing({username, credentials})
  }

  const fetchUser = ({id}) => {
    return apiService.fetchUser({id, credentials})
  }

  const followUser = (id) => {
    return apiService.followUser({credentials, id})
  }

  const unfollowUser = (id) => {
    return apiService.unfollowUser({credentials, id})
  }

  const blockUser = (id) => {
    return apiService.blockUser({credentials, id})
  }

  const unblockUser = (id) => {
    return apiService.unblockUser({credentials, id})
  }

  const approveUser = (id) => {
    return apiService.approveUser({credentials, id})
  }

  const denyUser = (id) => {
    return apiService.denyUser({credentials, id})
  }

  const startFetching = ({timeline, store, userId = false}) => {
    return timelineFetcherService.startFetching({timeline, store, credentials, userId})
  }

  const setUserMute = ({id, muted = true}) => {
    return apiService.setUserMute({id, muted, credentials})
  }

  const fetchMutes = () => apiService.fetchMutes({credentials})
  const fetchFollowRequests = () => apiService.fetchFollowRequests({credentials})

  const getCaptcha = () => apiService.getCaptcha()
  const register = (params) => apiService.register(params)
  const updateAvatar = ({params}) => apiService.updateAvatar({credentials, params})
  const updateBg = ({params}) => apiService.updateBg({credentials, params})
  const updateBanner = ({params}) => apiService.updateBanner({credentials, params})
  const updateProfile = ({params}) => apiService.updateProfile({credentials, params})

  const externalProfile = (profileUrl) => apiService.externalProfile({profileUrl, credentials})
  const followImport = ({params}) => apiService.followImport({params, credentials})

  const deleteAccount = ({password}) => apiService.deleteAccount({credentials, password})
  const changePassword = ({password, newPassword, newPasswordConfirmation}) => apiService.changePassword({credentials, password, newPassword, newPasswordConfirmation})

  const backendInteractorServiceInstance = {
    fetchStatus,
    fetchConversation,
    fetchFriends,
    fetchFollowers,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    fetchUser,
    fetchAllFollowing,
    verifyCredentials: apiService.verifyCredentials,
    startFetching,
    setUserMute,
    fetchMutes,
    register,
    getCaptcha,
    updateAvatar,
    updateBg,
    updateBanner,
    updateProfile,
    externalProfile,
    followImport,
    deleteAccount,
    changePassword,
    fetchFollowRequests,
    approveUser,
    denyUser
  }

  return backendInteractorServiceInstance
}

export default backendInteractorService
