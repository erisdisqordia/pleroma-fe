import {reduce} from 'lodash'

const getOrCreateApp = ({oauth, instance}) => {
  const url = `${instance}/api/v1/apps`
  const form = new window.FormData()

  form.append('client_name', `PleromaFE_${Math.random()}`)
  form.append('redirect_uris', `${window.location.origin}/oauth-callback`)
  form.append('scopes', 'read write follow')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}
const login = (args) => {
  getOrCreateApp(args).then((app) => {
    args.commit('setClientData', app)

    const data = {
      response_type: 'code',
      client_id: app.client_id,
      redirect_uri: app.redirect_uri,
      scope: 'read write follow'
    }

    const dataString = reduce(data, (acc, v, k) => {
      const encoded = `${k}=${encodeURIComponent(v)}`
      if (!acc) {
        return encoded
      } else {
        return `${acc}&${encoded}`
      }
    }, false)

    // Do the redirect...
    const url = `${args.instance}/oauth/authorize?${dataString}`

    window.location.href = url
  })
}

const getTokenWithCredentials = ({app, instance, username, password}) => {
  const url = `${instance}/oauth/token`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('grant_type', 'password')
  form.append('username', username)
  form.append('password', password)

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const getToken = ({app, instance, code}) => {
  const url = `${instance}/oauth/token`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('grant_type', 'authorization_code')
  form.append('code', code)
  form.append('redirect_uri', `${window.location.origin}/oauth-callback`)

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const oauth = {
  login,
  getToken,
  getTokenWithCredentials,
  getOrCreateApp
}

export default oauth
