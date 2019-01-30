
export const mentionMatchesUrl = (attention, url) => {
  if (url === attention.statusnet_profile_url) {
    return true
  }
  const [namepart, instancepart] = attention.screen_name.split('@')
  const matchstring = new RegExp('://' + instancepart + '/.*' + namepart + '$', 'g')
  return !!url.match(matchstring)
}
