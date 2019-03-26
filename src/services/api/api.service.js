/* eslint-env browser */
const LOGIN_URL = '/api/account/verify_credentials.json'
const FRIENDS_TIMELINE_URL = '/api/statuses/friends_timeline.json'
const ALL_FOLLOWING_URL = '/api/qvitter/allfollowing'
const PUBLIC_TIMELINE_URL = '/api/statuses/public_timeline.json'
const PUBLIC_AND_EXTERNAL_TIMELINE_URL = '/api/statuses/public_and_external_timeline.json'
const FAVORITE_URL = '/api/favorites/create'
const UNFAVORITE_URL = '/api/favorites/destroy'
const RETWEET_URL = '/api/statuses/retweet'
const UNRETWEET_URL = '/api/statuses/unretweet'
const STATUS_DELETE_URL = '/api/statuses/destroy'
const MENTIONS_URL = '/api/statuses/mentions.json'
const DM_TIMELINE_URL = '/api/statuses/dm_timeline.json'
const FOLLOWERS_URL = '/api/statuses/followers.json'
const FRIENDS_URL = '/api/statuses/friends.json'
const FOLLOWING_URL = '/api/friendships/create.json'
const UNFOLLOWING_URL = '/api/friendships/destroy.json'
const REGISTRATION_URL = '/api/account/register.json'
const AVATAR_UPDATE_URL = '/api/qvitter/update_avatar.json'
const BG_UPDATE_URL = '/api/qvitter/update_background_image.json'
const BANNER_UPDATE_URL = '/api/account/update_profile_banner.json'
const PROFILE_UPDATE_URL = '/api/account/update_profile.json'
const EXTERNAL_PROFILE_URL = '/api/externalprofile/show.json'
const QVITTER_USER_NOTIFICATIONS_URL = '/api/qvitter/statuses/notifications.json'
const QVITTER_USER_NOTIFICATIONS_READ_URL = '/api/qvitter/statuses/notifications/read.json'
const FOLLOW_IMPORT_URL = '/api/pleroma/follow_import'
const DELETE_ACCOUNT_URL = '/api/pleroma/delete_account'
const CHANGE_PASSWORD_URL = '/api/pleroma/change_password'
const FOLLOW_REQUESTS_URL = '/api/pleroma/friend_requests'
const APPROVE_USER_URL = '/api/pleroma/friendships/approve'
const DENY_USER_URL = '/api/pleroma/friendships/deny'
const SUGGESTIONS_URL = '/api/v1/suggestions'

const MASTODON_USER_FAVORITES_TIMELINE_URL = '/api/v1/favourites'
const MASTODON_STATUS_URL = id => `/api/v1/statuses/${id}`
const MASTODON_STATUS_CONTEXT_URL = id => `/api/v1/statuses/${id}/context`
const MASTODON_USER_URL = '/api/v1/accounts'
const MASTODON_USER_RELATIONSHIPS_URL = '/api/v1/accounts/relationships'
const MASTODON_USER_TIMELINE_URL = id => `/api/v1/accounts/${id}/statuses`
const MASTODON_TAG_TIMELINE_URL = tag => `/api/v1/timelines/tag/${tag}`
const MASTODON_USER_BLOCKS_URL = '/api/v1/blocks/'
const MASTODON_USER_MUTES_URL = '/api/v1/mutes/'
const MASTODON_BLOCK_USER_URL = id => `/api/v1/accounts/${id}/block`
const MASTODON_UNBLOCK_USER_URL = id => `/api/v1/accounts/${id}/unblock`
const MASTODON_MUTE_USER_URL = id => `/api/v1/accounts/${id}/mute`
const MASTODON_UNMUTE_USER_URL = id => `/api/v1/accounts/${id}/unmute`
const MASTODON_POST_STATUS_URL = '/api/v1/statuses'
const MASTODON_MEDIA_UPLOAD_URL = '/api/v1/media'

import { each, map } from 'lodash'
import { parseStatus, parseUser, parseNotification, parseAttachment } from '../entity_normalizer/entity_normalizer.service.js'
import 'whatwg-fetch'
import { StatusCodeError } from '../errors/errors'

const oldfetch = window.fetch

let fetch = (url, options) => {
  options = options || {}
  const baseUrl = ''
  const fullUrl = baseUrl + url
  options.credentials = 'same-origin'
  return oldfetch(fullUrl, options)
}

const promisedRequest = (url, options) => {
  return fetch(url, options)
    .then((response) => {
      return new Promise((resolve, reject) => response.json()
        .then((json) => {
          if (!response.ok) {
            return reject(new StatusCodeError(response.status, json, { url, options }, response))
          }
          return resolve(json)
        }))
    })
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
  // Always include these fields, because they might be empty or false
  const fields = ['description', 'locked', 'no_rich_text', 'hide_follows', 'hide_followers', 'show_role']
  let url = PROFILE_UPDATE_URL

  const form = new FormData()

  each(params, (value, key) => {
    if (fields.includes(key) || value) {
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

const getCaptcha = () => fetch('/api/pleroma/captcha').then(resp => resp.json())

const authHeaders = (accessToken) => {
  if (accessToken) {
    return { 'Authorization': `Bearer ${accessToken}` }
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
  return fetch(MASTODON_BLOCK_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unblockUser = ({id, credentials}) => {
  return fetch(MASTODON_UNBLOCK_USER_URL(id), {
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
  let url = `${MASTODON_USER_URL}/${id}`
  return promisedRequest(url, { headers: authHeaders(credentials) })
    .then((data) => parseUser(data))
}

const fetchUserRelationship = ({id, credentials}) => {
  let url = `${MASTODON_USER_RELATIONSHIPS_URL}/?id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((response) => {
      return new Promise((resolve, reject) => response.json()
        .then((json) => {
          if (!response.ok) {
            return reject(new StatusCodeError(response.status, json, { url }, response))
          }
          return resolve(json)
        }))
    })
}

const fetchFriends = ({id, page, credentials}) => {
  let url = `${FRIENDS_URL}?user_id=${id}`
  if (page) {
    url = url + `&page=${page}`
  }
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const exportFriends = ({id, credentials}) => {
  let url = `${FRIENDS_URL}?user_id=${id}&all=true`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchFollowers = ({id, page, credentials}) => {
  let url = `${FOLLOWERS_URL}?user_id=${id}`
  if (page) {
    url = url + `&page=${page}`
  }
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchAllFollowing = ({username, credentials}) => {
  const url = `${ALL_FOLLOWING_URL}/${username}.json`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchFollowRequests = ({credentials}) => {
  const url = FOLLOW_REQUESTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const fetchConversation = ({id, credentials}) => {
  let urlContext = MASTODON_STATUS_CONTEXT_URL(id)
  return fetch(urlContext, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then(({ancestors, descendants}) => ({
      ancestors: ancestors.map(parseStatus),
      descendants: descendants.map(parseStatus)
    }))
}

const fetchStatus = ({id, credentials}) => {
  let url = MASTODON_STATUS_URL(id)
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then((data) => parseStatus(data))
}

const fetchTimeline = ({timeline, credentials, since = false, until = false, userId = false, tag = false, withMuted = false}) => {
  const timelineUrls = {
    public: PUBLIC_TIMELINE_URL,
    friends: FRIENDS_TIMELINE_URL,
    mentions: MENTIONS_URL,
    dms: DM_TIMELINE_URL,
    notifications: QVITTER_USER_NOTIFICATIONS_URL,
    'publicAndExternal': PUBLIC_AND_EXTERNAL_TIMELINE_URL,
    user: MASTODON_USER_TIMELINE_URL,
    media: MASTODON_USER_TIMELINE_URL,
    favorites: MASTODON_USER_FAVORITES_TIMELINE_URL,
    tag: MASTODON_TAG_TIMELINE_URL
  }
  const isNotifications = timeline === 'notifications'
  const params = []

  let url = timelineUrls[timeline]

  if (timeline === 'user' || timeline === 'media') {
    url = url(userId)
  }

  if (since) {
    params.push(['since_id', since])
  }
  if (until) {
    params.push(['max_id', until])
  }
  if (tag) {
    url = url(tag)
  }
  if (timeline === 'media') {
    params.push(['only_media', 1])
  }

  params.push(['count', 20])
  params.push(['with_muted', withMuted])

  const queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then((data) => data.map(isNotifications ? parseNotification : parseStatus))
}

const verifyCredentials = (user) => {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: authHeaders(user)
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return {
          error: response
        }
      }
    })
    .then((data) => data.error ? data : parseUser(data))
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

const postStatus = ({credentials, status, spoilerText, visibility, sensitive, mediaIds = [], inReplyToStatusId, contentType}) => {
  const form = new FormData()

  form.append('status', status)
  form.append('source', 'Pleroma FE')
  if (spoilerText) form.append('spoiler_text', spoilerText)
  if (visibility) form.append('visibility', visibility)
  if (sensitive) form.append('sensitive', sensitive)
  if (contentType) form.append('content_type', contentType)
  mediaIds.forEach(val => {
    form.append('media_ids[]', val)
  })
  if (inReplyToStatusId) {
    form.append('in_reply_to_id', inReplyToStatusId)
  }

  return fetch(MASTODON_POST_STATUS_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return {
          error: response
        }
      }
    })
    .then((data) => data.error ? data : parseStatus(data))
}

const deleteStatus = ({ id, credentials }) => {
  return fetch(`${STATUS_DELETE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const uploadMedia = ({formData, credentials}) => {
  return fetch(MASTODON_MEDIA_UPLOAD_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((data) => data.json())
    .then((data) => parseAttachment(data))
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
  return promisedRequest(MASTODON_USER_MUTES_URL, { headers: authHeaders(credentials) })
    .then((users) => users.map(parseUser))
}

const muteUser = ({id, credentials}) => {
  return promisedRequest(MASTODON_MUTE_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unmuteUser = ({id, credentials}) => {
  return promisedRequest(MASTODON_UNMUTE_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const fetchBlocks = ({credentials}) => {
  return promisedRequest(MASTODON_USER_BLOCKS_URL, { headers: authHeaders(credentials) })
    .then((users) => users.map(parseUser))
}

const fetchOAuthTokens = ({credentials}) => {
  const url = '/api/oauth_tokens.json'

  return fetch(url, {
    headers: authHeaders(credentials)
  }).then((data) => {
    if (data.ok) {
      return data.json()
    }
    throw new Error('Error fetching auth tokens', data)
  })
}

const revokeOAuthToken = ({id, credentials}) => {
  const url = `/api/oauth_tokens/${id}`

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'DELETE'
  })
}

const suggestions = ({credentials}) => {
  return fetch(SUGGESTIONS_URL, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const markNotificationsAsSeen = ({id, credentials}) => {
  const body = new FormData()

  body.append('latest_id', id)

  return fetch(QVITTER_USER_NOTIFICATIONS_READ_URL, {
    body,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchConversation,
  fetchStatus,
  fetchFriends,
  exportFriends,
  fetchFollowers,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  fetchUser,
  fetchUserRelationship,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  postStatus,
  deleteStatus,
  uploadMedia,
  fetchAllFollowing,
  fetchMutes,
  muteUser,
  unmuteUser,
  fetchBlocks,
  fetchOAuthTokens,
  revokeOAuthToken,
  register,
  getCaptcha,
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
  denyUser,
  suggestions,
  markNotificationsAsSeen
}

export default apiService
