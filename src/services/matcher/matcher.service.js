export const mentionMatchesUrl = (attention, url) => {
  if (url === attention.statusnet_profile_url) {
    return true
  }
  const [namepart, instancepart] = attention.screen_name.split('@')
  const matchstring = new RegExp('://' + instancepart + '/.*' + namepart + '$', 'g')

  return !!url.match(matchstring)
}

/**
 * Extract tag name from pleroma or mastodon url.
 * i.e https://bikeshed.party/tag/photo or https://quey.org/tags/sky
 * @param {string} url
 */
export const extractTagFromUrl = (url) => {
  const regex = /tag[s]*\/(\w+)$/g
  const result = regex.exec(url)
  if (!result) {
    return false
  }
  return result[1]
}
