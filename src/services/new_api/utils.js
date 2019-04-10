const queryParams = (params) => {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

const headers = (store) => {
  const accessToken = store.state.oauth.token
  if (accessToken) {
    return {'Authorization': `Bearer ${accessToken}`}
  } else {
    return {}
  }
}

const request = ({method = 'GET', url, params, store}) => {
  const instance = store.state.instance.server
  let fullUrl = `${instance}${url}`

  if (method === 'GET' && params) {
    fullUrl = fullUrl + `?${queryParams(params)}`
  }

  return window.fetch(fullUrl, {
    method,
    headers: headers(store),
    credentials: 'same-origin'
  })
}

const utils = {
  queryParams,
  request
}

export default utils
