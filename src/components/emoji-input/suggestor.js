/**
 * suggest - generates a suggestor function to be used by emoji-input
 * data: object providing source information for specific types of suggestions:
 * data.emoji - optional, an array of all emoji available i.e.
 *   (state.instance.emoji + state.instance.customEmoji)
 * data.users - optional, an array of all known users
 *
 * Depending on data present one or both (or none) can be present, so if field
 * doesn't support user linking you can just provide only emoji.
 */
export default function suggest (data) {
  return input => {
    const firstChar = input[0]
    if (firstChar === ':' && data.emoji) {
      return suggestEmoji(data.emoji)(input)
    }
    if (firstChar === '@' && data.users) {
      return suggestUsers(data.users)(input)
    }
    return []
  }
}

function suggestEmoji (emojis) {
  return input => {
    const noPrefix = input.toLowerCase().substr(1)
    return emojis
      .filter(({ displayText }) => displayText.toLowerCase().startsWith(noPrefix))
      .sort((a, b) => {
        let aScore = 0
        let bScore = 0

        // Make custom emojis a priority
        aScore += Number(!!a.imageUrl) * 10
        bScore += Number(!!b.imageUrl) * 10

        // Sort alphabetically
        const alphabetically = a.displayText > b.displayText ? 1 : -1

        return bScore - aScore + alphabetically
      })
  }
}

function suggestUsers (users) {
  return input => {
    const noPrefix = input.toLowerCase().substr(1)
    return users.filter(
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
      aScore += a.screen_name.toLowerCase().startsWith(noPrefix) * 2
      bScore += b.screen_name.toLowerCase().startsWith(noPrefix) * 2

      // Matches on name takes second priority
      aScore += a.name.toLowerCase().startsWith(noPrefix)
      bScore += b.name.toLowerCase().startsWith(noPrefix)

      const diff = bScore * 10 - aScore * 10

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
    /* eslint-enable camelcase */
  }
}
