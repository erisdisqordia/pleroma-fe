import utils from './utils.js'
import { parseUser } from '../entity_normalizer/entity_normalizer.service.js'

const search = ({ query, store }) => {
  return utils.request({
    store,
    url: '/api/v1/accounts/search',
    params: {
      q: query,
      resolve: true
    }
  })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}
const UserSearch = {
  search
}

export default UserSearch
