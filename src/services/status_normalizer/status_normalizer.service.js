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

const isMastoAPI = (status) => {
  return status.hasOwnProperty('account')
}

export const parseUser = (data) => {
  const output = {}
  const masto = data.hasOwnProperty('acct')
  // case for users in "mentions" property for statuses in MastoAPI
  const mastoShort = masto && !data.hasOwnProperty('avatar')

  output.id = data.id

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
    output.is_local = data.is_local
  }

  output.created_at = new Date(data.created_at)
  output.locked = data.locked
  output.followers_count = data.followers_count
  output.statuses_count = data.statuses_count

  return output
}

const parseAttachment = (data) => {
  return {
    ...data,
    mimetype: data.mimetype || data.type
  }
}

export const parseStatus = (data) => {
  const output = {}
  const masto = isMastoAPI(data)
  output.raw = data

  console.log(masto ? 'MAMMAL' : 'OLD SHIT')
  console.log(data)
  if (masto) {
    output.favorited = data.favourited
    output.fave_num = data.favourites_count

    output.repeated = data.reblogged
    output.repeat_num = data.reblogs_count

    output.type = data.reblog ? 'retweet' : 'status'
    output.nsfw = data.sensitive

    output.statusnet_html = data.content
    // Not exactly the same...
    output.text = data.content

    output.in_reply_to_status_id = data.in_reply_to_id
    output.in_reply_to_user_id = data.in_reply_to_user_id
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
    }
    output.statusnet_html = data.statusnet_html
    output.text = data.text

    output.in_reply_to_status_id = data.in_reply_to_id
    output.in_reply_to_user_id = data.in_reply_to_account_id
  }

  output.id = Number(data.id)
  output.visibility = data.visibility
  output.created_at = new Date(data.created_at)

  output.user = parseUser(masto ? data.account : data.user)

  output.attentions = ((masto ? data.mentions : data.attentions) || [])
    .map(_ => ({
      id: _.id,
      following: _.following // FIXME: MastoAPI doesn't have this
    }))

  output.attachments = ((masto ? data.media_attachments : data.attachments) || [])
    .map(parseAttachment)

  const retweetedStatus = masto ? data.reblog : data.retweeted_status
  if (retweetedStatus) {
    output.retweeted_status = parseStatus(retweetedStatus)
  }

  return output
}

const isNsfw = (status) => {
  const nsfwRegex = /#nsfw/i
  return (status.tags || []).includes('nsfw') || !!status.text.match(nsfwRegex)
}
