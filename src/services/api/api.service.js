/* eslint-env browser */
const LOGIN_URL = '/api/account/verify_credentials.json'
const FRIENDS_TIMELINE_URL = '/api/statuses/friends_timeline.json'
const ALL_FOLLOWING_URL = '/api/qvitter/allfollowing'
const PUBLIC_TIMELINE_URL = '/api/statuses/public_timeline.json'
const PUBLIC_AND_EXTERNAL_TIMELINE_URL = '/api/statuses/public_and_external_timeline.json'
const TAG_TIMELINE_URL = '/api/statusnet/tags/timeline'
const FAVORITE_URL = '/api/favorites/create'
const UNFAVORITE_URL = '/api/favorites/destroy'
const RETWEET_URL = '/api/statuses/retweet'
const UNRETWEET_URL = '/api/statuses/unretweet'
const STATUS_UPDATE_URL = '/api/statuses/update.json'
const STATUS_DELETE_URL = '/api/statuses/destroy'
const STATUS_URL = '/api/statuses/show'
const MEDIA_UPLOAD_URL = '/api/statusnet/media/upload'
const CONVERSATION_URL = '/api/statusnet/conversation'
const MENTIONS_URL = '/api/statuses/mentions.json'
const FOLLOWERS_URL = '/api/statuses/followers.json'
const FRIENDS_URL = '/api/statuses/friends.json'
const FOLLOWING_URL = '/api/friendships/create.json'
const UNFOLLOWING_URL = '/api/friendships/destroy.json'
const QVITTER_USER_PREF_URL = '/api/qvitter/set_profile_pref.json'
const REGISTRATION_URL = '/api/account/register.json'
const AVATAR_UPDATE_URL = '/api/qvitter/update_avatar.json'
const BG_UPDATE_URL = '/api/qvitter/update_background_image.json'
const BANNER_UPDATE_URL = '/api/account/update_profile_banner.json'
const PROFILE_UPDATE_URL = '/api/account/update_profile.json'
const EXTERNAL_PROFILE_URL = '/api/externalprofile/show.json'
const QVITTER_USER_TIMELINE_URL = '/api/qvitter/statuses/user_timeline.json'
const BLOCKING_URL = '/api/blocks/create.json'
const UNBLOCKING_URL = '/api/blocks/destroy.json'
const USER_URL = '/api/users/show.json'
const FOLLOW_IMPORT_URL = '/api/pleroma/follow_import'
const DELETE_ACCOUNT_URL = '/api/pleroma/delete_account'
const CHANGE_PASSWORD_URL = '/api/pleroma/change_password'
const FOLLOW_REQUESTS_URL = '/api/pleroma/friend_requests'
const APPROVE_USER_URL = '/api/pleroma/friendships/approve'
const DENY_USER_URL = '/api/pleroma/friendships/deny'

import { each, map } from 'lodash'
import 'whatwg-fetch'

const oldfetch = window.fetch

let fetch = (url, options) => {
  options = options || {}
  const baseUrl = ''
  const fullUrl = baseUrl + url
  options.credentials = 'same-origin'
  return oldfetch(fullUrl, options)
}

// from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
let utoa = (str) => {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(encodeURIComponent(str)
              .replace(/%([0-9A-F]{2})/g,
                       (match, p1) => { return String.fromCharCode('0x' + p1) }))
}

// Params
// cropH
// cropW
// cropX
// cropY
// img (base 64 encodend data url)
const updateAvatar = ({credentials, params}) => {
  let url = AVATAR_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

const updateBg = ({credentials, params}) => {
  let url = BG_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params
// height
// width
// offset_left
// offset_top
// banner (base 64 encodend data url)
const updateBanner = ({credentials, params}) => {
  let url = BANNER_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params
// name
// url
// location
// description
const updateProfile = ({credentials, params}) => {
  let url = PROFILE_UPDATE_URL

  console.log(params)

  const form = new FormData()

  each(params, (value, key) => {
    /* Always include description and locked, because it might be empty or false */
    if (key === 'description' || key === 'locked' || value) {
      form.append(key, value)
    }
  })
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST',
    body: form
  }).then((data) => data.json())
}

// Params needed:
// nickname
// email
// fullname
// password
// password_confirm
//
// Optional
// bio
// homepage
// location
// token
const register = (params) => {
  const form = new FormData()

  each(params, (value, key) => {
    if (value) {
      form.append(key, value)
    }
  })

  return fetch(REGISTRATION_URL, {
    method: 'POST',
    body: form
  })
}

const authHeaders = (user) => {
  if (user && user.username && user.password) {
    return { 'Authorization': `Basic ${utoa(`${user.username}:${user.password}`)}` }
  } else {
    return { }
  }
}

const externalProfile = ({profileUrl, credentials}) => {
  let url = `${EXTERNAL_PROFILE_URL}?profileurl=${profileUrl}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const followUser = ({id, credentials}) => {
  let url = `${FOLLOWING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unfollowUser = ({id, credentials}) => {
  let url = `${UNFOLLOWING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const blockUser = ({id, credentials}) => {
  let url = `${BLOCKING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unblockUser = ({id, credentials}) => {
  let url = `${UNBLOCKING_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const approveUser = ({id, credentials}) => {
  let url = `${APPROVE_USER_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const denyUser = ({id, credentials}) => {
  let url = `${DENY_USER_URL}?user_id=${id}`
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const fetchUser = ({id, credentials}) => {
  let url = `${USER_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFriends = ({id, credentials}) => {
  let url = `${FRIENDS_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFollowers = ({id, credentials}) => {
  let url = `${FOLLOWERS_URL}?user_id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchAllFollowing = ({username, credentials}) => {
  const url = `${ALL_FOLLOWING_URL}/${username}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchFollowRequests = ({credentials}) => {
  const url = FOLLOW_REQUESTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchConversation = ({id, credentials}) => {
  let url = `${CONVERSATION_URL}/${id}.json?count=100`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchStatus = ({id, credentials}) => {
  let url = `${STATUS_URL}/${id}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const setUserMute = ({id, credentials, muted = true}) => {
  const form = new FormData()

  const muteInteger = muted ? 1 : 0

  form.append('namespace', 'qvitter')
  form.append('data', muteInteger)
  form.append('topic', `mute:${id}`)

  return fetch(QVITTER_USER_PREF_URL, {
    method: 'POST',
    headers: authHeaders(credentials),
    body: form
  })
}

const fetchTimeline = ({timeline, credentials, since = false, until = false, userId = false, tag = false}) => {
  const timelineUrls = {
    public: PUBLIC_TIMELINE_URL,
    friends: FRIENDS_TIMELINE_URL,
    mentions: MENTIONS_URL,
    'publicAndExternal': PUBLIC_AND_EXTERNAL_TIMELINE_URL,
    user: QVITTER_USER_TIMELINE_URL,
    tag: TAG_TIMELINE_URL
  }

  let url = timelineUrls[timeline]

  let params = []

  if (since) {
    params.push(['since_id', since])
  }
  if (until) {
    params.push(['max_id', until])
  }
  if (userId) {
    params.push(['user_id', userId])
  }
  if (tag) {
    url += `/${tag}.json`
  }

  params.push(['count', 20])

  const queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  return fetch(url, { headers: authHeaders(credentials) }).then((data) => data.json())
}

const verifyCredentials = (user) => {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: authHeaders(user)
  })
}

const favorite = ({ id, credentials }) => {
  return fetch(`${FAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unfavorite = ({ id, credentials }) => {
  return fetch(`${UNFAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const retweet = ({ id, credentials }) => {
  return fetch(`${RETWEET_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unretweet = ({ id, credentials }) => {
  return fetch(`${UNRETWEET_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const postStatus = ({credentials, status, spoilerText, visibility, mediaIds, inReplyToStatusId}) => {
  const idsText = mediaIds.join(',')
  const form = new FormData()

  form.append('status', status)
  form.append('source', 'Pleroma FE')
  if (spoilerText) form.append('spoiler_text', spoilerText)
  if (visibility) form.append('visibility', visibility)
  form.append('media_ids', idsText)
  if (inReplyToStatusId) {
    form.append('in_reply_to_status_id', inReplyToStatusId)
  }

  return fetch(STATUS_UPDATE_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
}

const deleteStatus = ({ id, credentials }) => {
  return fetch(`${STATUS_DELETE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const uploadMedia = ({formData, credentials}) => {
  return fetch(MEDIA_UPLOAD_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.text())
    .then((text) => (new DOMParser()).parseFromString(text, 'application/xml'))
}

const followImport = ({params, credentials}) => {
  return fetch(FOLLOW_IMPORT_URL, {
    body: params,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const deleteAccount = ({credentials, password}) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(DELETE_ACCOUNT_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changePassword = ({credentials, password, newPassword, newPasswordConfirmation}) => {
  const form = new FormData()

  form.append('password', password)
  form.append('new_password', newPassword)
  form.append('new_password_confirmation', newPasswordConfirmation)

  return fetch(CHANGE_PASSWORD_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const fetchMutes = ({credentials}) => {
  const url = '/api/qvitter/mutes.json'

  return fetch(url, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchConversation,
  fetchStatus,
  fetchFriends,
  fetchFollowers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  fetchUser,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  postStatus,
  deleteStatus,
  uploadMedia,
  fetchAllFollowing,
  setUserMute,
  fetchMutes,
  register,
  updateAvatar,
  updateBg,
  updateProfile,
  updateBanner,
  externalProfile,
  followImport,
  deleteAccount,
  changePassword,
  fetchFollowRequests,
  approveUser,
  denyUser
}

export default apiService
