import utils from './utils.js'

const search = ({query, store}) => {
  return utils.request({
    store,
    url: '/api/pleroma/search_user',
    params: {
      query
    }
  }).then((data) => data.json())
}
const UserSearch = {
  search
}

export default UserSearch
