import { debounce } from 'lodash'
/**
 * suggest - generates a suggestor function to be used by emoji-input
 * data: object providing source information for specific types of suggestions:
 * data.emoji - optional, an array of all emoji available i.e.
 *   (state.instance.emoji + state.instance.customEmoji)
 * data.users - optional, an array of all known users
 * updateUsersList - optional, a function to search and append to users
 *
 * Depending on data present one or both (or none) can be present, so if field
 * doesn't support user linking you can just provide only emoji.
 */

const debounceUserSearch = debounce((data, input) => {
  data.updateUsersList(input)
}, 500)

export default data => input => {
  const firstChar = input[0]
  if (firstChar === ':' && data.emoji) {
    return suggestEmoji(data.emoji)(input)
  }
  if (firstChar === '@' && data.users) {
    return suggestUsers(data)(input)
  }
  return []
}

export const suggestEmoji = emojis => input => {
  const noPrefix = input.toLowerCase().substr(1)
  return emojis
    .filter(({ displayText }) => displayText.toLowerCase().match(noPrefix))
    .sort((a, b) => {
      let aScore = 0
      let bScore = 0

      // An exact match always wins
      aScore += a.displayText.toLowerCase() === noPrefix ? 200 : 0
      bScore += b.displayText.toLowerCase() === noPrefix ? 200 : 0

      // Prioritize custom emoji a lot
      aScore += a.imageUrl ? 100 : 0
      bScore += b.imageUrl ? 100 : 0

      // Prioritize prefix matches somewhat
      aScore += a.displayText.toLowerCase().startsWith(noPrefix) ? 10 : 0
      bScore += b.displayText.toLowerCase().startsWith(noPrefix) ? 10 : 0

      // Sort by length
      aScore -= a.displayText.length
      bScore -= b.displayText.length

      // Break ties alphabetically
      const alphabetically = a.displayText > b.displayText ? 0.5 : -0.5

      return bScore - aScore + alphabetically
    })
}

export const suggestUsers = data => input => {
  const noPrefix = input.toLowerCase().substr(1)
  const users = data.users

  const newUsers = users.filter(
    user =>
      user.screen_name.toLowerCase().startsWith(noPrefix) ||
      user.name.toLowerCase().startsWith(noPrefix)

    /* taking only 20 results so that sorting is a bit cheaper, we display
     * only 5 anyway. could be inaccurate, but we ideally we should query
     * backend anyway
     */
  ).slice(0, 20).sort((a, b) => {
    let aScore = 0
    let bScore = 0

    // Matches on screen name (i.e. user@instance) makes a priority
    aScore += a.screen_name.toLowerCase().startsWith(noPrefix) ? 2 : 0
    bScore += b.screen_name.toLowerCase().startsWith(noPrefix) ? 2 : 0

    // Matches on name takes second priority
    aScore += a.name.toLowerCase().startsWith(noPrefix) ? 1 : 0
    bScore += b.name.toLowerCase().startsWith(noPrefix) ? 1 : 0

    const diff = (bScore - aScore) * 10

    // Then sort alphabetically
    const nameAlphabetically = a.name > b.name ? 1 : -1
    const screenNameAlphabetically = a.screen_name > b.screen_name ? 1 : -1

    return diff + nameAlphabetically + screenNameAlphabetically
    /* eslint-disable camelcase */
  }).map(({ screen_name, name, profile_image_url_original }) => ({
    displayText: screen_name,
    detailText: name,
    imageUrl: profile_image_url_original,
    replacement: '@' + screen_name + ' '
  }))

  // BE search users to get more comprehensive results
  if (data.updateUsersList) {
    debounceUserSearch(data, noPrefix)
  }
  return newUsers
  /* eslint-enable camelcase */
}
