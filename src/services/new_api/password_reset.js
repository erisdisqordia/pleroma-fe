import { reduce } from 'lodash'

const MASTODON_PASSWORD_RESET_URL = `/auth/password`

const resetPassword = ({ instance, email }) => {
  const params = { email }
  const query = reduce(params, (acc, v, k) => {
    const encoded = `${k}=${encodeURIComponent(v)}`
    return `${acc}&${encoded}`
  }, '')
  const url = `${instance}${MASTODON_PASSWORD_RESET_URL}?${query}`

  return window.fetch(url, {
    method: 'POST'
  })
}

export default resetPassword
