import escape from 'escape-html'
import parseLinkHeader from 'parse-link-header'
import { isStatusNotification } from '../notification_utils/notification_utils.js'

const qvitterStatusType = (status) => {
  if (status.is_post_verb) {
    return 'status'
  }

  if (status.retweeted_status) {
    return 'retweet'
  }

  if ((typeof status.uri === 'string' && status.uri.match(/(fave|objectType=Favourite)/)) ||
      (typeof status.text === 'string' && status.text.match(/favorited/))) {
    return 'favorite'
  }

  if (status.text.match(/deleted notice {{tag/) || status.qvitter_delete_notice) {
    return 'deletion'
  }

  if (status.text.match(/started following/) || status.activity_type === 'follow') {
    return 'follow'
  }

  return 'unknown'
}

export const parseUser = (data) => {
  const output = {}
  const masto = data.hasOwnProperty('acct')
  // case for users in "mentions" property for statuses in MastoAPI
  const mastoShort = masto && !data.hasOwnProperty('avatar')

  output.id = String(data.id)

  if (masto) {
    output.screen_name = data.acct
    output.statusnet_profile_url = data.url

    // There's nothing else to get
    if (mastoShort) {
      return output
    }

    output.name = data.display_name
    output.name_html = addEmojis(escape(data.display_name), data.emojis)

    output.description = data.note
    output.description_html = addEmojis(data.note, data.emojis)

    output.fields = data.fields
    output.fields_html = data.fields.map(field => {
      return {
        name: addEmojis(escape(field.name), data.emojis),
        value: addEmojis(field.value, data.emojis)
      }
    })
    output.fields_text = data.fields.map(field => {
      return {
        name: unescape(field.name.replace(/<[^>]*>/g, '')),
        value: unescape(field.value.replace(/<[^>]*>/g, ''))
      }
    })

    // Utilize avatar_static for gif avatars?
    output.profile_image_url = data.avatar
    output.profile_image_url_original = data.avatar

    // Same, utilize header_static?
    output.cover_photo = data.header

    output.friends_count = data.following_count

    output.bot = data.bot

    if (data.pleroma) {
      const relationship = data.pleroma.relationship

      output.background_image = data.pleroma.background_image
      output.favicon = data.pleroma.favicon
      output.token = data.pleroma.chat_token

      if (relationship) {
        output.relationship = relationship
      }

      output.allow_following_move = data.pleroma.allow_following_move

      output.hide_follows = data.pleroma.hide_follows
      output.hide_followers = data.pleroma.hide_followers
      output.hide_follows_count = data.pleroma.hide_follows_count
      output.hide_followers_count = data.pleroma.hide_followers_count

      output.rights = {
        moderator: data.pleroma.is_moderator,
        admin: data.pleroma.is_admin
      }
      // TODO: Clean up in UI? This is duplication from what BE does for qvitterapi
      if (output.rights.admin) {
        output.role = 'admin'
      } else if (output.rights.moderator) {
        output.role = 'moderator'
      } else {
        output.role = 'member'
      }
    }

    if (data.source) {
      output.description = data.source.note
      output.default_scope = data.source.privacy
      output.fields = data.source.fields
      if (data.source.pleroma) {
        output.no_rich_text = data.source.pleroma.no_rich_text
        output.show_role = data.source.pleroma.show_role
        output.discoverable = data.source.pleroma.discoverable
      }
    }

    // TODO: handle is_local
    output.is_local = !output.screen_name.includes('@')
  } else {
    output.screen_name = data.screen_name

    output.name = data.name
    output.name_html = data.name_html

    output.description = data.description
    output.description_html = data.description_html

    output.profile_image_url = data.profile_image_url
    output.profile_image_url_original = data.profile_image_url_original

    output.cover_photo = data.cover_photo

    output.friends_count = data.friends_count

    // output.bot = ??? missing

    output.statusnet_profile_url = data.statusnet_profile_url

    output.is_local = data.is_local
    output.role = data.role
    output.show_role = data.show_role

    if (data.rights) {
      output.rights = {
        moderator: data.rights.delete_others_notice,
        admin: data.rights.admin
      }
    }
    output.no_rich_text = data.no_rich_text
    output.default_scope = data.default_scope
    output.hide_follows = data.hide_follows
    output.hide_followers = data.hide_followers
    output.hide_follows_count = data.hide_follows_count
    output.hide_followers_count = data.hide_followers_count
    output.background_image = data.background_image
    // Websocket token
    output.token = data.token

    // Convert relationsip data to expected format
    output.relationship = {
      muting: data.muted,
      blocking: data.statusnet_blocking,
      followed_by: data.follows_you,
      following: data.following
    }
  }

  output.created_at = new Date(data.created_at)
  output.locked = data.locked
  output.followers_count = data.followers_count
  output.statuses_count = data.statuses_count
  output.friendIds = []
  output.followerIds = []
  output.pinnedStatusIds = []

  if (data.pleroma) {
    output.follow_request_count = data.pleroma.follow_request_count

    output.tags = data.pleroma.tags
    output.deactivated = data.pleroma.deactivated

    output.notification_settings = data.pleroma.notification_settings
    output.unread_chat_count = data.pleroma.unread_chat_count
  }

  output.tags = output.tags || []
  output.rights = output.rights || {}
  output.notification_settings = output.notification_settings || {}

  return output
}

export const parseAttachment = (data) => {
  const output = {}
  const masto = !data.hasOwnProperty('oembed')

  if (masto) {
    // Not exactly same...
    output.mimetype = data.pleroma ? data.pleroma.mime_type : data.type
    output.meta = data.meta // not present in BE yet
    output.id = data.id
  } else {
    output.mimetype = data.mimetype
    // output.meta = ??? missing
  }

  output.url = data.url
  output.large_thumb_url = data.preview_url
  output.description = data.description

  return output
}
export const addEmojis = (string, emojis) => {
  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g
  return emojis.reduce((acc, emoji) => {
    const regexSafeShortCode = emoji.shortcode.replace(matchOperatorsRegex, '\\$&')
    return acc.replace(
      new RegExp(`:${regexSafeShortCode}:`, 'g'),
      `<img src='${emoji.url}' alt=':${emoji.shortcode}:' title=':${emoji.shortcode}:' class='emoji' />`
    )
  }, string)
}

export const parseStatus = (data) => {
  const output = {}
  const masto = data.hasOwnProperty('account')

  if (masto) {
    output.favorited = data.favourited
    output.fave_num = data.favourites_count

    output.repeated = data.reblogged
    output.repeat_num = data.reblogs_count

    output.bookmarked = data.bookmarked

    output.type = data.reblog ? 'retweet' : 'status'
    output.nsfw = data.sensitive

    output.statusnet_html = addEmojis(data.content, data.emojis)

    output.tags = data.tags

    if (data.pleroma) {
      const { pleroma } = data
      output.text = pleroma.content ? data.pleroma.content['text/plain'] : data.content
      output.summary = pleroma.spoiler_text ? data.pleroma.spoiler_text['text/plain'] : data.spoiler_text
      output.statusnet_conversation_id = data.pleroma.conversation_id
      output.is_local = pleroma.local
      output.in_reply_to_screen_name = data.pleroma.in_reply_to_account_acct
      output.thread_muted = pleroma.thread_muted
      output.emoji_reactions = pleroma.emoji_reactions
      output.parent_visible = pleroma.parent_visible === undefined ? true : pleroma.parent_visible
    } else {
      output.text = data.content
      output.summary = data.spoiler_text
    }

    output.in_reply_to_status_id = data.in_reply_to_id
    output.in_reply_to_user_id = data.in_reply_to_account_id
    output.replies_count = data.replies_count

    if (output.type === 'retweet') {
      output.retweeted_status = parseStatus(data.reblog)
    }

    output.summary_html = addEmojis(escape(data.spoiler_text), data.emojis)
    output.external_url = data.url
    output.poll = data.poll
    if (output.poll) {
      output.poll.options = (output.poll.options || []).map(field => ({
        ...field,
        title_html: addEmojis(field.title, data.emojis)
      }))
    }
    output.pinned = data.pinned
    output.muted = data.muted
  } else {
    output.favorited = data.favorited
    output.fave_num = data.fave_num

    output.repeated = data.repeated
    output.repeat_num = data.repeat_num

    // catchall, temporary
    // Object.assign(output, data)

    output.type = qvitterStatusType(data)

    if (data.nsfw === undefined) {
      output.nsfw = isNsfw(data)
      if (data.retweeted_status) {
        output.nsfw = data.retweeted_status.nsfw
      }
    } else {
      output.nsfw = data.nsfw
    }

    output.statusnet_html = data.statusnet_html
    output.text = data.text

    output.in_reply_to_status_id = data.in_reply_to_status_id
    output.in_reply_to_user_id = data.in_reply_to_user_id
    output.in_reply_to_screen_name = data.in_reply_to_screen_name
    output.statusnet_conversation_id = data.statusnet_conversation_id

    if (output.type === 'retweet') {
      output.retweeted_status = parseStatus(data.retweeted_status)
    }

    output.summary = data.summary
    output.summary_html = data.summary_html
    output.external_url = data.external_url
    output.is_local = data.is_local
  }

  output.id = String(data.id)
  output.visibility = data.visibility
  output.card = data.card
  output.created_at = new Date(data.created_at)

  // Converting to string, the right way.
  output.in_reply_to_status_id = output.in_reply_to_status_id
    ? String(output.in_reply_to_status_id)
    : null
  output.in_reply_to_user_id = output.in_reply_to_user_id
    ? String(output.in_reply_to_user_id)
    : null

  output.user = parseUser(masto ? data.account : data.user)

  output.attentions = ((masto ? data.mentions : data.attentions) || []).map(parseUser)

  output.attachments = ((masto ? data.media_attachments : data.attachments) || [])
    .map(parseAttachment)

  const retweetedStatus = masto ? data.reblog : data.retweeted_status
  if (retweetedStatus) {
    output.retweeted_status = parseStatus(retweetedStatus)
  }

  output.favoritedBy = []
  output.rebloggedBy = []

  return output
}

export const parseNotification = (data) => {
  const mastoDict = {
    'favourite': 'like',
    'reblog': 'repeat'
  }
  const masto = !data.hasOwnProperty('ntype')
  const output = {}

  if (masto) {
    output.type = mastoDict[data.type] || data.type
    output.seen = data.pleroma.is_seen
    output.status = isStatusNotification(output.type) ? parseStatus(data.status) : null
    output.action = output.status // TODO: Refactor, this is unneeded
    output.target = output.type !== 'move'
      ? null
      : parseUser(data.target)
    output.from_profile = parseUser(data.account)
    output.emoji = data.emoji
  } else {
    const parsedNotice = parseStatus(data.notice)
    output.type = data.ntype
    output.seen = Boolean(data.is_seen)
    output.status = output.type === 'like'
      ? parseStatus(data.notice.favorited_status)
      : parsedNotice
    output.action = parsedNotice
    output.from_profile = output.type === 'pleroma:chat_mention' ? parseUser(data.account) : parseUser(data.from_profile)
  }

  output.created_at = new Date(data.created_at)
  output.id = parseInt(data.id)

  return output
}

const isNsfw = (status) => {
  const nsfwRegex = /#nsfw/i
  return (status.tags || []).includes('nsfw') || !!(status.text || '').match(nsfwRegex)
}

export const parseLinkHeaderPagination = (linkHeader, opts = {}) => {
  const flakeId = opts.flakeId
  const parsedLinkHeader = parseLinkHeader(linkHeader)
  if (!parsedLinkHeader) return
  const maxId = parsedLinkHeader.next.max_id
  const minId = parsedLinkHeader.prev.min_id

  return {
    maxId: flakeId ? maxId : parseInt(maxId, 10),
    minId: flakeId ? minId : parseInt(minId, 10)
  }
}

export const parseChat = (chat) => {
  const output = {}
  output.id = chat.id
  output.account = parseUser(chat.account)
  output.unread = chat.unread
  output.lastMessage = parseChatMessage(chat.last_message)
  output.updated_at = new Date(chat.updated_at)
  return output
}

export const parseChatMessage = (message) => {
  if (!message) { return }
  if (message.isNormalized) { return message }
  const output = message
  output.id = message.id
  output.created_at = new Date(message.created_at)
  output.chat_id = message.chat_id
  if (message.content) {
    output.content = addEmojis(message.content, message.emojis)
  } else {
    output.content = ''
  }
  if (message.attachment) {
    output.attachments = [parseAttachment(message.attachment)]
  } else {
    output.attachments = []
  }
  output.pending = !!message.pending
  output.error = false
  output.idempotency_key = message.idempotency_key
  output.isNormalized = true
  return output
}
