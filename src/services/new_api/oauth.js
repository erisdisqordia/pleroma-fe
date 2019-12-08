import { reduce } from 'lodash'

const REDIRECT_URI = `${window.location.origin}/oauth-callback`

export const getOrCreateApp = ({ clientId, clientSecret, instance, commit }) => {
  if (clientId && clientSecret) {
    return Promise.resolve({ clientId, clientSecret })
  }

  const url = `${instance}/api/v1/apps`
  const form = new window.FormData()

  form.append('client_name', `PleromaFE_${window.___pleromafe_commit_hash}_${(new Date()).toISOString()}`)
  form.append('redirect_uris', REDIRECT_URI)
  form.append('scopes', 'read write follow push admin')

  return window.fetch(url, {
    method: 'POST',
    body: form
  })
    .then((data) => data.json())
    .then((app) => ({ clientId: app.client_id, clientSecret: app.client_secret }))
    .then((app) => commit('setClientData', app) || app)
}

const login = ({ instance, clientId }) => {
  const data = {
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    scope: 'read write follow push admin'
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
  const url = `${instance}/oauth/authorize?${dataString}`

  window.location.href = url
}

const getTokenWithCredentials = ({ clientId, clientSecret, instance, username, password }) => {
  const url = `${instance}/oauth/token`
  const form = new window.FormData()

  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('grant_type', 'password')
  form.append('username', username)
  form.append('password', password)

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const getToken = ({ clientId, clientSecret, instance, code }) => {
  const url = `${instance}/oauth/token`
  const form = new window.FormData()

  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('grant_type', 'authorization_code')
  form.append('code', code)
  form.append('redirect_uri', `${window.location.origin}/oauth-callback`)

  return window.fetch(url, {
    method: 'POST',
    body: form
  })
    .then((data) => data.json())
}

export const getClientToken = ({ clientId, clientSecret, instance }) => {
  const url = `${instance}/oauth/token`
  const form = new window.FormData()

  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('grant_type', 'client_credentials')
  form.append('redirect_uri', `${window.location.origin}/oauth-callback`)

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}
const verifyOTPCode = ({ app, instance, mfaToken, code }) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'totp')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const verifyRecoveryCode = ({ app, instance, mfaToken, code }) => {
  const url = `${instance}/oauth/mfa/challenge`
  const form = new window.FormData()

  form.append('client_id', app.client_id)
  form.append('client_secret', app.client_secret)
  form.append('mfa_token', mfaToken)
  form.append('code', code)
  form.append('challenge_type', 'recovery')

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const revokeToken = ({ app, instance, token }) => {
  const url = `${instance}/oauth/revoke`
  const form = new window.FormData()

  form.append('client_id', app.clientId)
  form.append('client_secret', app.clientSecret)
  form.append('token', token)

  return window.fetch(url, {
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const oauth = {
  login,
  getToken,
  getTokenWithCredentials,
  getOrCreateApp,
  verifyOTPCode,
  verifyRecoveryCode,
  revokeToken
}

export default oauth
