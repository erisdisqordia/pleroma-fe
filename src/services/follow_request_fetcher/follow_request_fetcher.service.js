import apiService from '../api/api.service.js'

const fetchAndUpdate = ({ store, credentials }) => {
  return apiService.fetchFollowRequests({ credentials })
    .then((requests) => {
      store.commit('setFollowRequests', requests)
      store.commit('addNewUsers', requests)
    }, () => {})
    .catch(() => {})
}

const startFetching = ({ credentials, store }) => {
  fetchAndUpdate({ credentials, store })
  const boundFetchAndUpdate = () => fetchAndUpdate({ credentials, store })
  return setInterval(boundFetchAndUpdate, 10000)
}

const followRequestFetcher = {
  startFetching
}

export default followRequestFetcher
