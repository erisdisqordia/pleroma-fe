import apiService from '../api/api.service.js'
import { makeFetcher } from '../fetcher/fetcher.js'

const fetchAndUpdate = ({ store, credentials }) => {
  return apiService.fetchFollowRequests({ credentials })
    .then((requests) => {
      store.commit('setFollowRequests', requests)
      store.commit('addNewUsers', requests)
    }, () => {})
    .catch(() => {})
}

const startFetching = ({ credentials, store }) => {
  const boundFetchAndUpdate = () => fetchAndUpdate({ credentials, store })
  boundFetchAndUpdate()
  return makeFetcher(boundFetchAndUpdate, 10000)
}

const followRequestFetcher = {
  startFetching
}

export default followRequestFetcher
