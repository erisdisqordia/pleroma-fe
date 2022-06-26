import apiService from '../api/api.service.js'
import { promiseInterval } from '../promise_interval/promise_interval.js'

const fetchAndUpdate = ({ store, credentials }) => {
  return apiService.fetchLists({ credentials })
    .then(lists => {
      store.commit('setLists', lists)
    }, () => {})
    .catch(() => {})
}

const startFetching = ({ credentials, store }) => {
  const boundFetchAndUpdate = () => fetchAndUpdate({ credentials, store })
  boundFetchAndUpdate()
  return promiseInterval(boundFetchAndUpdate, 240000)
}

const listsFetcher = {
  startFetching
}

export default listsFetcher
