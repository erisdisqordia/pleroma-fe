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

    // There's nothing else to get
    if (mastoShort) {
      return output
    }

    output.name = null // missing
    output.name_html = data.display_name

    output.description = null // missing
    output.description_html = data.note

    // Utilize avatar_static for gif avatars?
    output.profile_image_url = data.avatar
    output.profile_image_url_original = data.avatar

    // Same, utilize header_static?
    output.cover_photo = data.header

    output.friends_count = data.following_count

    output.bot = data.bot

    output.statusnet_profile_url = data.url

    if (data.pleroma) {
      const pleroma = data.pleroma
      output.follows_you = pleroma.follows_you
      output.statusnet_blocking = pleroma.statusnet_blocking
      output.muted = pleroma.muted
    }

    // Missing, trying to recover
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

    output.bot = null // missing

    output.statusnet_profile_url = data.statusnet_profile_url

    output.statusnet_blocking = data.statusnet_blocking

    output.is_local = data.is_local

    output.follows_you = data.follows_you

    output.muted = data.muted

    // QVITTER ONLY FOR NOW
    // Really only applies to logged in user, really.. I THINK
    output.rights = data.rights
    output.no_rich_text = data.no_rich_text
    output.default_scope = data.default_scope
    output.hide_followings = data.hide_followings
    output.hide_followers = data.hide_followers
    output.background_image = data.background_image
    // on mastoapi this info is contained in a "relationship"
    output.following = data.following
    // Websocket token
    output.token = data.token
  }

  output.created_at = new Date(data.created_at)
  output.locked = data.locked
  output.followers_count = data.followers_count
  output.statuses_count = data.statuses_count

  return output
}

const parseAttachment = (data) => {
  const output = {}
  const masto = !data.hasOwnProperty('oembed')

  if (masto) {
    // Not exactly same...
    output.mimetype = data.type
    output.meta = data.meta // not present in BE yet
  } else {
    output.mimetype = data.mimetype
    output.meta = null // missing
  }

  output.url = data.url
  output.description = data.description

  return output
}

export const parseStatus = (data) => {
  const output = {}
  const masto = data.hasOwnProperty('account')

  if (masto) {
    output.favorited = data.favourited
    output.fave_num = data.favourites_count

    output.repeated = data.reblogged
    output.repeat_num = data.reblogs_count

    output.type = data.reblog ? 'retweet' : 'status'
    output.nsfw = data.sensitive

    output.statusnet_html = data.content

    // Not exactly the same but works?
    output.text = data.content

    output.in_reply_to_status_id = data.in_reply_to_id
    output.in_reply_to_user_id = data.in_reply_to_account_id

    // Missing!! fix in UI?
    output.in_reply_to_screen_name = null

    // Not exactly the same but works
    output.statusnet_conversation_id = data.id

    if (output.type === 'retweet') {
      output.retweeted_status = parseStatus(data.reblog)
    }

    output.summary = data.spoiler_text
    output.summary_html = data.spoiler_text
    output.external_url = data.url

    // FIXME missing!!
    output.is_local = false
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
    output.seen = null // missing
    output.status = parseStatus(data.status)
    output.action = output.status // not sure
    output.from_profile = parseUser(data.account)
  } else {
    const parsedNotice = parseStatus(data.notice)
    output.type = data.ntype
    output.seen = Boolean(data.is_seen)
    output.status = output.type === 'like'
      ? parseStatus(data.notice.favorited_status)
      : parsedNotice
    output.action = parsedNotice
    output.from_profile = parseUser(data.from_profile)
  }

  output.created_at = new Date(data.created_at)
  output.id = String(data.id)

  return output
}

const isNsfw = (status) => {
  const nsfwRegex = /#nsfw/i
  return (status.tags || []).includes('nsfw') || !!status.text.match(nsfwRegex)
}
