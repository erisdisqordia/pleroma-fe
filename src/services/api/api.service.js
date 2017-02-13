/* eslint-env browser */
const LOGIN_URL = '/api/account/verify_credentials.json'
const FRIENDS_TIMELINE_URL = '/api/statuses/friends_timeline.json'
const ALL_FOLLOWING_URL = '/api/qvitter/allfollowing'
const PUBLIC_TIMELINE_URL = '/api/statuses/public_timeline.json'
const PUBLIC_AND_EXTERNAL_TIMELINE_URL = '/api/statuses/public_and_external_timeline.json'
const FAVORITE_URL = '/api/favorites/create'
const UNFAVORITE_URL = '/api/favorites/destroy'
const RETWEET_URL = '/api/statuses/retweet'
const STATUS_UPDATE_URL = '/api/statuses/update.json'
const STATUS_DELETE_URL = '/api/statuses/destroy'
const STATUS_URL = '/api/statuses/show'
const MEDIA_UPLOAD_URL = '/api/statusnet/media/upload'
const CONVERSATION_URL = '/api/statusnet/conversation'
const MENTIONS_URL = '/api/statuses/mentions.json'
const FRIENDS_URL = '/api/statuses/friends.json'
const FOLLOWING_URL = '/api/friendships/create.json'
const UNFOLLOWING_URL = '/api/friendships/destroy.json'
// const USER_URL = '/api/users/show.json'

const oldfetch = window.fetch

let fetch = (url, options) => {
  const baseUrl = ''
  const fullUrl = baseUrl + url
  return oldfetch(fullUrl, options)
}

const authHeaders = (user) => {
  if (user && user.username && user.password) {
    return { 'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}` }
  } else {
    return { }
  }
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

const fetchFriends = ({credentials}) => {
  return fetch(FRIENDS_URL, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchAllFollowing = ({username, credentials}) => {
  const url = `${ALL_FOLLOWING_URL}/${username}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json().users)
}

const fetchMentions = ({username, sinceId = 0, credentials}) => {
  let url = `${MENTIONS_URL}?since_id=${sinceId}&screen_name=${username}`
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

const fetchTimeline = ({timeline, credentials, since = false, until = false}) => {
  const timelineUrls = {
    public: PUBLIC_TIMELINE_URL,
    friends: FRIENDS_TIMELINE_URL,
    'publicAndExternal': PUBLIC_AND_EXTERNAL_TIMELINE_URL
  }

  let url = timelineUrls[timeline]

  if (since) {
    url += `?since_id=${since}`
  }

  if (until) {
    url += `?max_id=${until}`
  }

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

const postStatus = ({credentials, status, mediaIds, inReplyToStatusId}) => {
  const idsText = mediaIds.join(',')
  const form = new FormData()

  form.append('status', status)
  form.append('source', 'Pleroma FE')
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

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchConversation,
  fetchStatus,
  fetchMentions,
  fetchFriends,
  followUser,
  unfollowUser,
  favorite,
  unfavorite,
  retweet,
  postStatus,
  deleteStatus,
  uploadMedia,
  fetchAllFollowing
}

export default apiService
