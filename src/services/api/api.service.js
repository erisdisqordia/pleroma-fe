import { each, map, concat, last, get } from 'lodash'
import { parseStatus, parseUser, parseNotification, parseAttachment, parseChat, parseLinkHeaderPagination } from '../entity_normalizer/entity_normalizer.service.js'
import { RegistrationError, StatusCodeError } from '../errors/errors'

/* eslint-env browser */
const MUTES_IMPORT_URL = '/api/pleroma/mutes_import'
const BLOCKS_IMPORT_URL = '/api/pleroma/blocks_import'
const FOLLOW_IMPORT_URL = '/api/pleroma/follow_import'
const DELETE_ACCOUNT_URL = '/api/pleroma/delete_account'
const CHANGE_EMAIL_URL = '/api/pleroma/change_email'
const CHANGE_PASSWORD_URL = '/api/pleroma/change_password'
const TAG_USER_URL = '/api/pleroma/admin/users/tag'
const PERMISSION_GROUP_URL = (screenName, right) => `/api/pleroma/admin/users/${screenName}/permission_group/${right}`
const ACTIVATE_USER_URL = '/api/pleroma/admin/users/activate'
const DEACTIVATE_USER_URL = '/api/pleroma/admin/users/deactivate'
const ADMIN_USERS_URL = '/api/pleroma/admin/users'
const SUGGESTIONS_URL = '/api/v1/suggestions'
const NOTIFICATION_SETTINGS_URL = '/api/pleroma/notification_settings'
const NOTIFICATION_READ_URL = '/api/v1/pleroma/notifications/read'

const MFA_SETTINGS_URL = '/api/pleroma/accounts/mfa'
const MFA_BACKUP_CODES_URL = '/api/pleroma/accounts/mfa/backup_codes'

const MFA_SETUP_OTP_URL = '/api/pleroma/accounts/mfa/setup/totp'
const MFA_CONFIRM_OTP_URL = '/api/pleroma/accounts/mfa/confirm/totp'
const MFA_DISABLE_OTP_URL = '/api/pleroma/accounts/mfa/totp'

const MASTODON_LOGIN_URL = '/api/v1/accounts/verify_credentials'
const MASTODON_REGISTRATION_URL = '/api/v1/accounts'
const MASTODON_USER_FAVORITES_TIMELINE_URL = '/api/v1/favourites'
const MASTODON_USER_NOTIFICATIONS_URL = '/api/v1/notifications'
const MASTODON_DISMISS_NOTIFICATION_URL = id => `/api/v1/notifications/${id}/dismiss`
const MASTODON_FAVORITE_URL = id => `/api/v1/statuses/${id}/favourite`
const MASTODON_UNFAVORITE_URL = id => `/api/v1/statuses/${id}/unfavourite`
const MASTODON_RETWEET_URL = id => `/api/v1/statuses/${id}/reblog`
const MASTODON_UNRETWEET_URL = id => `/api/v1/statuses/${id}/unreblog`
const MASTODON_DELETE_URL = id => `/api/v1/statuses/${id}`
const MASTODON_FOLLOW_URL = id => `/api/v1/accounts/${id}/follow`
const MASTODON_UNFOLLOW_URL = id => `/api/v1/accounts/${id}/unfollow`
const MASTODON_FOLLOWING_URL = id => `/api/v1/accounts/${id}/following`
const MASTODON_FOLLOWERS_URL = id => `/api/v1/accounts/${id}/followers`
const MASTODON_FOLLOW_REQUESTS_URL = '/api/v1/follow_requests'
const MASTODON_APPROVE_USER_URL = id => `/api/v1/follow_requests/${id}/authorize`
const MASTODON_DENY_USER_URL = id => `/api/v1/follow_requests/${id}/reject`
const MASTODON_DIRECT_MESSAGES_TIMELINE_URL = '/api/v1/timelines/direct'
const MASTODON_PUBLIC_TIMELINE = '/api/v1/timelines/public'
const MASTODON_USER_HOME_TIMELINE_URL = '/api/v1/timelines/home'
const MASTODON_STATUS_URL = id => `/api/v1/statuses/${id}`
const MASTODON_STATUS_CONTEXT_URL = id => `/api/v1/statuses/${id}/context`
const MASTODON_USER_URL = '/api/v1/accounts'
const MASTODON_USER_RELATIONSHIPS_URL = '/api/v1/accounts/relationships'
const MASTODON_USER_TIMELINE_URL = id => `/api/v1/accounts/${id}/statuses`
const MASTODON_LIST_URL = id => `/api/v1/lists/${id}`
const MASTODON_LIST_TIMELINE_URL = id => `/api/v1/timelines/list/${id}`
const MASTODON_LIST_ACCOUNTS_URL = id => `/api/v1/lists/${id}/accounts`
const MASTODON_TAG_TIMELINE_URL = tag => `/api/v1/timelines/tag/${tag}`
const MASTODON_BOOKMARK_TIMELINE_URL = '/api/v1/bookmarks'
const MASTODON_USER_BLOCKS_URL = '/api/v1/blocks/'
const MASTODON_USER_MUTES_URL = '/api/v1/mutes/'
const MASTODON_BLOCK_USER_URL = id => `/api/v1/accounts/${id}/block`
const MASTODON_UNBLOCK_USER_URL = id => `/api/v1/accounts/${id}/unblock`
const MASTODON_MUTE_USER_URL = id => `/api/v1/accounts/${id}/mute`
const MASTODON_UNMUTE_USER_URL = id => `/api/v1/accounts/${id}/unmute`
const MASTODON_SUBSCRIBE_USER = id => `/api/v1/pleroma/accounts/${id}/subscribe`
const MASTODON_UNSUBSCRIBE_USER = id => `/api/v1/pleroma/accounts/${id}/unsubscribe`
const MASTODON_BOOKMARK_STATUS_URL = id => `/api/v1/statuses/${id}/bookmark`
const MASTODON_UNBOOKMARK_STATUS_URL = id => `/api/v1/statuses/${id}/unbookmark`
const MASTODON_POST_STATUS_URL = '/api/v1/statuses'
const MASTODON_MEDIA_UPLOAD_URL = '/api/v1/media'
const MASTODON_VOTE_URL = id => `/api/v1/polls/${id}/votes`
const MASTODON_POLL_URL = id => `/api/v1/polls/${id}`
const MASTODON_STATUS_FAVORITEDBY_URL = id => `/api/v1/statuses/${id}/favourited_by`
const MASTODON_STATUS_REBLOGGEDBY_URL = id => `/api/v1/statuses/${id}/reblogged_by`
const MASTODON_PROFILE_UPDATE_URL = '/api/v1/accounts/update_credentials'
const MASTODON_REPORT_USER_URL = '/api/v1/reports'
const MASTODON_PIN_OWN_STATUS = id => `/api/v1/statuses/${id}/pin`
const MASTODON_UNPIN_OWN_STATUS = id => `/api/v1/statuses/${id}/unpin`
const MASTODON_MUTE_CONVERSATION = id => `/api/v1/statuses/${id}/mute`
const MASTODON_UNMUTE_CONVERSATION = id => `/api/v1/statuses/${id}/unmute`
const MASTODON_SEARCH_2 = `/api/v2/search`
const MASTODON_USER_SEARCH_URL = '/api/v1/accounts/search'
const MASTODON_DOMAIN_BLOCKS_URL = '/api/v1/domain_blocks'
const MASTODON_LISTS_URL = '/api/v1/lists'
const MASTODON_STREAMING = '/api/v1/streaming'
const MASTODON_KNOWN_DOMAIN_LIST_URL = '/api/v1/instance/peers'
const PLEROMA_EMOJI_REACTIONS_URL = id => `/api/v1/pleroma/statuses/${id}/reactions`
const PLEROMA_EMOJI_REACT_URL = (id, emoji) => `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
const PLEROMA_EMOJI_UNREACT_URL = (id, emoji) => `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
const PLEROMA_CHATS_URL = `/api/v1/pleroma/chats`
const PLEROMA_CHAT_URL = id => `/api/v1/pleroma/chats/by-account-id/${id}`
const PLEROMA_CHAT_MESSAGES_URL = id => `/api/v1/pleroma/chats/${id}/messages`
const PLEROMA_CHAT_READ_URL = id => `/api/v1/pleroma/chats/${id}/read`
const PLEROMA_DELETE_CHAT_MESSAGE_URL = (chatId, messageId) => `/api/v1/pleroma/chats/${chatId}/messages/${messageId}`

const oldfetch = window.fetch

let fetch = (url, options) => {
  options = options || {}
  const baseUrl = ''
  const fullUrl = baseUrl + url
  options.credentials = 'same-origin'
  return oldfetch(fullUrl, options)
}

const promisedRequest = ({ method, url, params, payload, credentials, headers = {} }) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  }
  if (params) {
    url += '?' + Object.entries(params)
      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&')
  }
  if (payload) {
    options.body = JSON.stringify(payload)
  }
  if (credentials) {
    options.headers = {
      ...options.headers,
      ...authHeaders(credentials)
    }
  }
  return fetch(url, options)
    .then((response) => {
      return new Promise((resolve, reject) => response.json()
        .then((json) => {
          if (!response.ok) {
            return reject(new StatusCodeError(response.status, json, { url, options }, response))
          }
          return resolve(json)
        })
        .catch((error) => {
          return reject(new StatusCodeError(response.status, error, { url, options }, response))
        })
      )
    })
}

const updateNotificationSettings = ({ credentials, settings }) => {
  const form = new FormData()

  each(settings, (value, key) => {
    form.append(key, value)
  })

  return fetch(NOTIFICATION_SETTINGS_URL, {
    headers: authHeaders(credentials),
    method: 'PUT',
    body: form
  }).then((data) => data.json())
}

const updateProfileImages = ({ credentials, avatar = null, banner = null, background = null }) => {
  const form = new FormData()
  if (avatar !== null) form.append('avatar', avatar)
  if (banner !== null) form.append('header', banner)
  if (background !== null) form.append('pleroma_background_image', background)
  return fetch(MASTODON_PROFILE_UPDATE_URL, {
    headers: authHeaders(credentials),
    method: 'PATCH',
    body: form
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error)
      }
      return parseUser(data)
    })
}

const updateProfile = ({ credentials, params }) => {
  return promisedRequest({
    url: MASTODON_PROFILE_UPDATE_URL,
    method: 'PATCH',
    payload: params,
    credentials
  }).then((data) => parseUser(data))
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
const register = ({ params, credentials }) => {
  const { nickname, ...rest } = params
  return fetch(MASTODON_REGISTRATION_URL, {
    method: 'POST',
    headers: {
      ...authHeaders(credentials),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname,
      locale: 'en_US',
      agreement: true,
      ...rest
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then((error) => { throw new RegistrationError(error) })
      }
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

const followUser = ({ id, credentials, ...options }) => {
  let url = MASTODON_FOLLOW_URL(id)
  const form = {}
  if (options.reblogs !== undefined) { form['reblogs'] = options.reblogs }
  return fetch(url, {
    body: JSON.stringify(form),
    headers: {
      ...authHeaders(credentials),
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((data) => data.json())
}

const unfollowUser = ({ id, credentials }) => {
  let url = MASTODON_UNFOLLOW_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const pinOwnStatus = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_PIN_OWN_STATUS(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const unpinOwnStatus = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNPIN_OWN_STATUS(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const muteConversation = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_MUTE_CONVERSATION(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const unmuteConversation = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNMUTE_CONVERSATION(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const blockUser = ({ id, credentials }) => {
  return fetch(MASTODON_BLOCK_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unblockUser = ({ id, credentials }) => {
  return fetch(MASTODON_UNBLOCK_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const approveUser = ({ id, credentials }) => {
  let url = MASTODON_APPROVE_USER_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const denyUser = ({ id, credentials }) => {
  let url = MASTODON_DENY_USER_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const fetchUser = ({ id, credentials }) => {
  let url = `${MASTODON_USER_URL}/${id}`
  return promisedRequest({ url, credentials })
    .then((data) => parseUser(data))
}

const fetchUserRelationship = ({ id, credentials }) => {
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

const fetchFriends = ({ id, maxId, sinceId, limit = 20, credentials }) => {
  let url = MASTODON_FOLLOWING_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`,
    `with_relationships=true`
  ].filter(_ => _).join('&')

  url = url + (args ? '?' + args : '')
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const exportFriends = ({ id, credentials }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let friends = []
      let more = true
      while (more) {
        const maxId = friends.length > 0 ? last(friends).id : undefined
        const users = await fetchFriends({ id, maxId, credentials })
        friends = concat(friends, users)
        if (users.length === 0) {
          more = false
        }
      }
      resolve(friends)
    } catch (err) {
      reject(err)
    }
  })
}

const fetchFollowers = ({ id, maxId, sinceId, limit = 20, credentials }) => {
  let url = MASTODON_FOLLOWERS_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`,
    `with_relationships=true`
  ].filter(_ => _).join('&')

  url += args ? '?' + args : ''
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchFollowRequests = ({ credentials }) => {
  const url = MASTODON_FOLLOW_REQUESTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchLists = ({ credentials }) => {
  const url = MASTODON_LISTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const createList = ({ title, credentials }) => {
  const url = MASTODON_LISTS_URL
  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ title })
  }).then((data) => data.json())
}

const getList = ({ id, credentials }) => {
  const url = MASTODON_LIST_URL(id)
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
}

const updateList = ({ id, title, credentials }) => {
  const url = MASTODON_LIST_URL(id)
  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({ title })
  })
}

const getListAccounts = ({ id, credentials }) => {
  const url = MASTODON_LIST_ACCOUNTS_URL(id)
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(({ id }) => id))
}

const addAccountsToList = ({ id, accountIds, credentials }) => {
  const url = MASTODON_LIST_ACCOUNTS_URL(id)
  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ account_ids: accountIds })
  })
}

const removeAccountsFromList = ({ id, accountIds, credentials }) => {
  const url = MASTODON_LIST_ACCOUNTS_URL(id)
  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(url, {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify({ account_ids: accountIds })
  })
}

const deleteList = ({ id, credentials }) => {
  const url = MASTODON_LIST_URL(id)
  return fetch(url, {
    method: 'DELETE',
    headers: authHeaders(credentials)
  })
}

const fetchConversation = ({ id, credentials }) => {
  let urlContext = MASTODON_STATUS_CONTEXT_URL(id)
  return fetch(urlContext, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then(({ ancestors, descendants }) => ({
      ancestors: ancestors.map(parseStatus),
      descendants: descendants.map(parseStatus)
    }))
}

const fetchStatus = ({ id, credentials }) => {
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

const tagUser = ({ tag, credentials, user }) => {
  const screenName = user.screen_name
  const form = {
    nicknames: [screenName],
    tags: [tag]
  }

  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(TAG_USER_URL, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(form)
  })
}

const untagUser = ({ tag, credentials, user }) => {
  const screenName = user.screen_name
  const body = {
    nicknames: [screenName],
    tags: [tag]
  }

  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(TAG_USER_URL, {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify(body)
  })
}

const addRight = ({ right, credentials, user }) => {
  const screenName = user.screen_name

  return fetch(PERMISSION_GROUP_URL(screenName, right), {
    method: 'POST',
    headers: authHeaders(credentials),
    body: {}
  })
}

const deleteRight = ({ right, credentials, user }) => {
  const screenName = user.screen_name

  return fetch(PERMISSION_GROUP_URL(screenName, right), {
    method: 'DELETE',
    headers: authHeaders(credentials),
    body: {}
  })
}

const activateUser = ({ credentials, user: { screen_name: nickname } }) => {
  return promisedRequest({
    url: ACTIVATE_USER_URL,
    method: 'PATCH',
    credentials,
    payload: {
      nicknames: [nickname]
    }
  }).then(response => get(response, 'users.0'))
}

const deactivateUser = ({ credentials, user: { screen_name: nickname } }) => {
  return promisedRequest({
    url: DEACTIVATE_USER_URL,
    method: 'PATCH',
    credentials,
    payload: {
      nicknames: [nickname]
    }
  }).then(response => get(response, 'users.0'))
}

const deleteUser = ({ credentials, user }) => {
  const screenName = user.screen_name
  const headers = authHeaders(credentials)

  return fetch(`${ADMIN_USERS_URL}?nickname=${screenName}`, {
    method: 'DELETE',
    headers: headers
  })
}

const fetchTimeline = ({
  timeline,
  credentials,
  since = false,
  until = false,
  userId = false,
  listId = false,
  tag = false,
  withMuted = false,
  replyVisibility = 'all'
}) => {
  const timelineUrls = {
    public: MASTODON_PUBLIC_TIMELINE,
    friends: MASTODON_USER_HOME_TIMELINE_URL,
    dms: MASTODON_DIRECT_MESSAGES_TIMELINE_URL,
    notifications: MASTODON_USER_NOTIFICATIONS_URL,
    'publicAndExternal': MASTODON_PUBLIC_TIMELINE,
    user: MASTODON_USER_TIMELINE_URL,
    media: MASTODON_USER_TIMELINE_URL,
    list: MASTODON_LIST_TIMELINE_URL,
    favorites: MASTODON_USER_FAVORITES_TIMELINE_URL,
    tag: MASTODON_TAG_TIMELINE_URL,
    bookmarks: MASTODON_BOOKMARK_TIMELINE_URL
  }
  const isNotifications = timeline === 'notifications'
  const params = []

  let url = timelineUrls[timeline]

  if (timeline === 'user' || timeline === 'media') {
    url = url(userId)
  }

  if (timeline === 'list') {
    url = url(listId)
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
  if (timeline === 'public') {
    params.push(['local', true])
  }
  if (timeline === 'public' || timeline === 'publicAndExternal') {
    params.push(['only_media', false])
  }
  if (timeline !== 'favorites' && timeline !== 'bookmarks') {
    params.push(['with_muted', withMuted])
  }
  if (replyVisibility !== 'all') {
    params.push(['reply_visibility', replyVisibility])
  }

  params.push(['limit', 20])

  const queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  let status = ''
  let statusText = ''

  let pagination = {}
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      status = data.status
      statusText = data.statusText
      pagination = parseLinkHeaderPagination(data.headers.get('Link'), {
        flakeId: timeline !== 'bookmarks' && timeline !== 'notifications'
      })
      return data
    })
    .then((data) => data.json())
    .then((data) => {
      if (!data.errors) {
        return { data: data.map(isNotifications ? parseNotification : parseStatus), pagination }
      } else {
        data.status = status
        data.statusText = statusText
        return data
      }
    })
}

const fetchPinnedStatuses = ({ id, credentials }) => {
  const url = MASTODON_USER_TIMELINE_URL(id) + '?pinned=true'
  return promisedRequest({ url, credentials })
    .then((data) => data.map(parseStatus))
}

const verifyCredentials = (user) => {
  return fetch(MASTODON_LOGIN_URL, {
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
  return promisedRequest({ url: MASTODON_FAVORITE_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const unfavorite = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNFAVORITE_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const retweet = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_RETWEET_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const unretweet = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNRETWEET_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const bookmarkStatus = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_BOOKMARK_STATUS_URL(id),
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unbookmarkStatus = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_UNBOOKMARK_STATUS_URL(id),
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const postStatus = ({
  credentials,
  status,
  spoilerText,
  visibility,
  sensitive,
  poll,
  mediaIds = [],
  inReplyToStatusId,
  contentType,
  preview,
  idempotencyKey
}) => {
  const form = new FormData()
  const pollOptions = poll.options || []

  form.append('status', status)
  form.append('source', 'Pleroma FE')
  if (spoilerText) form.append('spoiler_text', spoilerText)
  if (visibility) form.append('visibility', visibility)
  if (sensitive) form.append('sensitive', sensitive)
  if (contentType) form.append('content_type', contentType)
  mediaIds.forEach(val => {
    form.append('media_ids[]', val)
  })
  if (pollOptions.some(option => option !== '')) {
    const normalizedPoll = {
      expires_in: poll.expiresIn,
      multiple: poll.multiple
    }
    Object.keys(normalizedPoll).forEach(key => {
      form.append(`poll[${key}]`, normalizedPoll[key])
    })

    pollOptions.forEach(option => {
      form.append('poll[options][]', option)
    })
  }
  if (inReplyToStatusId) {
    form.append('in_reply_to_id', inReplyToStatusId)
  }
  if (preview) {
    form.append('preview', 'true')
  }

  let postHeaders = authHeaders(credentials)
  if (idempotencyKey) {
    postHeaders['idempotency-key'] = idempotencyKey
  }

  return fetch(MASTODON_POST_STATUS_URL, {
    body: form,
    method: 'POST',
    headers: postHeaders
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => data.error ? data : parseStatus(data))
}

const deleteStatus = ({ id, credentials }) => {
  return fetch(MASTODON_DELETE_URL(id), {
    headers: authHeaders(credentials),
    method: 'DELETE'
  })
}

const uploadMedia = ({ formData, credentials }) => {
  return fetch(MASTODON_MEDIA_UPLOAD_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((data) => data.json())
    .then((data) => parseAttachment(data))
}

const setMediaDescription = ({ id, description, credentials }) => {
  return promisedRequest({
    url: `${MASTODON_MEDIA_UPLOAD_URL}/${id}`,
    method: 'PUT',
    headers: authHeaders(credentials),
    payload: {
      description
    }
  }).then((data) => parseAttachment(data))
}

const importMutes = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(MUTES_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const importBlocks = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(BLOCKS_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const importFollows = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(FOLLOW_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const deleteAccount = ({ credentials, password }) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(DELETE_ACCOUNT_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changeEmail = ({ credentials, email, password }) => {
  const form = new FormData()

  form.append('email', email)
  form.append('password', password)

  return fetch(CHANGE_EMAIL_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changePassword = ({ credentials, password, newPassword, newPasswordConfirmation }) => {
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

const settingsMFA = ({ credentials }) => {
  return fetch(MFA_SETTINGS_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const mfaDisableOTP = ({ credentials, password }) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(MFA_DISABLE_OTP_URL, {
    body: form,
    method: 'DELETE',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const mfaConfirmOTP = ({ credentials, password, token }) => {
  const form = new FormData()

  form.append('password', password)
  form.append('code', token)

  return fetch(MFA_CONFIRM_OTP_URL, {
    body: form,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}
const mfaSetupOTP = ({ credentials }) => {
  return fetch(MFA_SETUP_OTP_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}
const generateMfaBackupCodes = ({ credentials }) => {
  return fetch(MFA_BACKUP_CODES_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const fetchMutes = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_USER_MUTES_URL, credentials })
    .then((users) => users.map(parseUser))
}

const muteUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_MUTE_USER_URL(id), credentials, method: 'POST' })
}

const unmuteUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNMUTE_USER_URL(id), credentials, method: 'POST' })
}

const subscribeUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_SUBSCRIBE_USER(id), credentials, method: 'POST' })
}

const unsubscribeUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNSUBSCRIBE_USER(id), credentials, method: 'POST' })
}

const fetchBlocks = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_USER_BLOCKS_URL, credentials })
    .then((users) => users.map(parseUser))
}

const fetchOAuthTokens = ({ credentials }) => {
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

const revokeOAuthToken = ({ id, credentials }) => {
  const url = `/api/oauth_tokens/${id}`

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'DELETE'
  })
}

const suggestions = ({ credentials }) => {
  return fetch(SUGGESTIONS_URL, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const markNotificationsAsSeen = ({ id, credentials, single = false }) => {
  const body = new FormData()

  if (single) {
    body.append('id', id)
  } else {
    body.append('max_id', id)
  }

  return fetch(NOTIFICATION_READ_URL, {
    body,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const vote = ({ pollId, choices, credentials }) => {
  const form = new FormData()
  form.append('choices', choices)

  return promisedRequest({
    url: MASTODON_VOTE_URL(encodeURIComponent(pollId)),
    method: 'POST',
    credentials,
    payload: {
      choices: choices
    }
  })
}

const fetchPoll = ({ pollId, credentials }) => {
  return promisedRequest(
    {
      url: MASTODON_POLL_URL(encodeURIComponent(pollId)),
      method: 'GET',
      credentials
    }
  )
}

const fetchFavoritedByUsers = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_STATUS_FAVORITEDBY_URL(id),
    method: 'GET',
    credentials
  }).then((users) => users.map(parseUser))
}

const fetchRebloggedByUsers = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_STATUS_REBLOGGEDBY_URL(id),
    method: 'GET',
    credentials
  }).then((users) => users.map(parseUser))
}

const fetchEmojiReactions = ({ id, credentials }) => {
  return promisedRequest({ url: PLEROMA_EMOJI_REACTIONS_URL(id), credentials })
    .then((reactions) => reactions.map(r => {
      r.accounts = r.accounts.map(parseUser)
      return r
    }))
}

const reactWithEmoji = ({ id, emoji, credentials }) => {
  return promisedRequest({
    url: PLEROMA_EMOJI_REACT_URL(id, emoji),
    method: 'PUT',
    credentials
  }).then(parseStatus)
}

const unreactWithEmoji = ({ id, emoji, credentials }) => {
  return promisedRequest({
    url: PLEROMA_EMOJI_UNREACT_URL(id, emoji),
    method: 'DELETE',
    credentials
  }).then(parseStatus)
}

const reportUser = ({ credentials, userId, statusIds, comment, forward }) => {
  return promisedRequest({
    url: MASTODON_REPORT_USER_URL,
    method: 'POST',
    payload: {
      'account_id': userId,
      'status_ids': statusIds,
      comment,
      forward
    },
    credentials
  })
}

const searchUsers = ({ credentials, query }) => {
  return promisedRequest({
    url: MASTODON_USER_SEARCH_URL,
    params: {
      q: query,
      resolve: true
    },
    credentials
  })
    .then((data) => data.map(parseUser))
}

const search2 = ({ credentials, q, resolve, limit, offset, following }) => {
  let url = MASTODON_SEARCH_2
  let params = []

  if (q) {
    params.push(['q', encodeURIComponent(q)])
  }

  if (resolve) {
    params.push(['resolve', resolve])
  }

  if (limit) {
    params.push(['limit', limit])
  }

  if (offset) {
    params.push(['offset', offset])
  }

  if (following) {
    params.push(['following', true])
  }

  params.push(['with_relationships', true])

  let queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching search result', data)
    })
    .then((data) => { return data.json() })
    .then((data) => {
      data.accounts = data.accounts.slice(0, limit).map(u => parseUser(u))
      data.statuses = data.statuses.slice(0, limit).map(s => parseStatus(s))
      return data
    })
}

const fetchKnownDomains = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_KNOWN_DOMAIN_LIST_URL, credentials })
}

const fetchDomainMutes = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_DOMAIN_BLOCKS_URL, credentials })
}

const muteDomain = ({ domain, credentials }) => {
  return promisedRequest({
    url: MASTODON_DOMAIN_BLOCKS_URL,
    method: 'POST',
    payload: { domain },
    credentials
  })
}

const unmuteDomain = ({ domain, credentials }) => {
  return promisedRequest({
    url: MASTODON_DOMAIN_BLOCKS_URL,
    method: 'DELETE',
    payload: { domain },
    credentials
  })
}

const dismissNotification = ({ credentials, id }) => {
  return promisedRequest({
    url: MASTODON_DISMISS_NOTIFICATION_URL(id),
    method: 'POST',
    payload: { id },
    credentials
  })
}

export const getMastodonSocketURI = ({ credentials, stream, args = {} }) => {
  return Object.entries({
    ...(credentials
      ? { access_token: credentials }
      : {}
    ),
    stream,
    ...args
  }).reduce((acc, [key, val]) => {
    return acc + `${key}=${val}&`
  }, MASTODON_STREAMING + '?')
}

const MASTODON_STREAMING_EVENTS = new Set([
  'update',
  'notification',
  'delete',
  'filters_changed'
])

const PLEROMA_STREAMING_EVENTS = new Set([
  'pleroma:chat_update'
])

// A thin wrapper around WebSocket API that allows adding a pre-processor to it
// Uses EventTarget and a CustomEvent to proxy events
export const ProcessedWS = ({
  url,
  preprocessor = handleMastoWS,
  id = 'Unknown'
}) => {
  const eventTarget = new EventTarget()
  const socket = new WebSocket(url)
  if (!socket) throw new Error(`Failed to create socket ${id}`)
  const proxy = (original, eventName, processor = a => a) => {
    original.addEventListener(eventName, (eventData) => {
      eventTarget.dispatchEvent(new CustomEvent(
        eventName,
        { detail: processor(eventData) }
      ))
    })
  }
  socket.addEventListener('open', (wsEvent) => {
    console.debug(`[WS][${id}] Socket connected`, wsEvent)
  })
  socket.addEventListener('error', (wsEvent) => {
    console.debug(`[WS][${id}] Socket errored`, wsEvent)
  })
  socket.addEventListener('close', (wsEvent) => {
    console.debug(
      `[WS][${id}] Socket disconnected with code ${wsEvent.code}`,
      wsEvent
    )
  })
  // Commented code reason: very spammy, uncomment to enable message debug logging
  /*
  socket.addEventListener('message', (wsEvent) => {
    console.debug(
      `[WS][${id}] Message received`,
      wsEvent
    )
  })
  /**/

  proxy(socket, 'open')
  proxy(socket, 'close')
  proxy(socket, 'message', preprocessor)
  proxy(socket, 'error')

  // 1000 = Normal Closure
  eventTarget.close = () => { socket.close(1000, 'Shutting down socket') }

  return eventTarget
}

export const handleMastoWS = (wsEvent) => {
  const { data } = wsEvent
  if (!data) return
  const parsedEvent = JSON.parse(data)
  const { event, payload } = parsedEvent
  if (MASTODON_STREAMING_EVENTS.has(event) || PLEROMA_STREAMING_EVENTS.has(event)) {
    // MastoBE and PleromaBE both send payload for delete as a PLAIN string
    if (event === 'delete') {
      return { event, id: payload }
    }
    const data = payload ? JSON.parse(payload) : null
    if (event === 'update') {
      return { event, status: parseStatus(data) }
    } else if (event === 'notification') {
      return { event, notification: parseNotification(data) }
    } else if (event === 'pleroma:chat_update') {
      return { event, chatUpdate: parseChat(data) }
    }
  } else {
    console.warn('Unknown event', wsEvent)
    return null
  }
}

export const WSConnectionStatus = Object.freeze({
  'JOINED': 1,
  'CLOSED': 2,
  'ERROR': 3
})

const chats = ({ credentials }) => {
  return fetch(PLEROMA_CHATS_URL, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => {
      return { chats: data.map(parseChat).filter(c => c) }
    })
}

const getOrCreateChat = ({ accountId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_CHAT_URL(accountId),
    method: 'POST',
    credentials
  })
}

const chatMessages = ({ id, credentials, maxId, sinceId, limit = 20 }) => {
  let url = PLEROMA_CHAT_MESSAGES_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`
  ].filter(_ => _).join('&')

  url = url + (args ? '?' + args : '')

  return promisedRequest({
    url,
    method: 'GET',
    credentials
  })
}

const sendChatMessage = ({ id, content, mediaId = null, idempotencyKey, credentials }) => {
  const payload = {
    'content': content
  }

  if (mediaId) {
    payload['media_id'] = mediaId
  }

  const headers = {}

  if (idempotencyKey) {
    headers['idempotency-key'] = idempotencyKey
  }

  return promisedRequest({
    url: PLEROMA_CHAT_MESSAGES_URL(id),
    method: 'POST',
    payload: payload,
    credentials,
    headers
  })
}

const readChat = ({ id, lastReadId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_CHAT_READ_URL(id),
    method: 'POST',
    payload: {
      'last_read_id': lastReadId
    },
    credentials
  })
}

const deleteChatMessage = ({ chatId, messageId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_DELETE_CHAT_MESSAGE_URL(chatId, messageId),
    method: 'DELETE',
    credentials
  })
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchPinnedStatuses,
  fetchConversation,
  fetchStatus,
  fetchFriends,
  exportFriends,
  fetchFollowers,
  followUser,
  unfollowUser,
  pinOwnStatus,
  unpinOwnStatus,
  muteConversation,
  unmuteConversation,
  blockUser,
  unblockUser,
  fetchUser,
  fetchUserRelationship,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  bookmarkStatus,
  unbookmarkStatus,
  postStatus,
  deleteStatus,
  uploadMedia,
  setMediaDescription,
  fetchMutes,
  muteUser,
  unmuteUser,
  subscribeUser,
  unsubscribeUser,
  fetchBlocks,
  fetchOAuthTokens,
  revokeOAuthToken,
  tagUser,
  untagUser,
  deleteUser,
  addRight,
  deleteRight,
  activateUser,
  deactivateUser,
  register,
  getCaptcha,
  updateProfileImages,
  updateProfile,
  importMutes,
  importBlocks,
  importFollows,
  deleteAccount,
  changeEmail,
  changePassword,
  settingsMFA,
  mfaDisableOTP,
  generateMfaBackupCodes,
  mfaSetupOTP,
  mfaConfirmOTP,
  fetchFollowRequests,
  fetchLists,
  createList,
  getList,
  updateList,
  getListAccounts,
  addAccountsToList,
  removeAccountsFromList,
  deleteList,
  approveUser,
  denyUser,
  suggestions,
  markNotificationsAsSeen,
  dismissNotification,
  vote,
  fetchPoll,
  fetchFavoritedByUsers,
  fetchRebloggedByUsers,
  fetchEmojiReactions,
  reactWithEmoji,
  unreactWithEmoji,
  reportUser,
  updateNotificationSettings,
  search2,
  searchUsers,
  fetchKnownDomains,
  fetchDomainMutes,
  muteDomain,
  unmuteDomain,
  chats,
  getOrCreateChat,
  chatMessages,
  sendChatMessage,
  readChat,
  deleteChatMessage
}

export default apiService
