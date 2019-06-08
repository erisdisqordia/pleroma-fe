export default function suggest (data) {
  return input => {
    const trimmed = input.trim()
    const firstChar = trimmed[0]
    console.log(`'${trimmed}'`, firstChar, firstChar === ':')
    if (firstChar === ':' && data.emoji) {
      return suggestEmoji(data.emoji)(trimmed)
    }
    if (firstChar === '@' && data.users) {
      return suggestUsers(data.users)(trimmed)
    }
    return []
  }
}

function suggestEmoji (emojis) {
  return input => {
    const noPrefix = input.toLowerCase().substr(1)
    return emojis
      .filter(({ displayText }) => displayText.toLowerCase().startsWith(noPrefix))
  }
}

function suggestUsers (users) {
  return input => {
    const noPrefix = input.toLowerCase().substr(1)
    return users.filter(
      user =>
        user.screen_name.toLowerCase().startsWith(noPrefix) ||
        user.name.toLowerCase().startsWith(noPrefix)
      /* eslint-disable camelcase */
    ).slice(0, 20).sort((a, b) => {
      let aScore = 0
      let bScore = 0

      aScore += a.screen_name.toLowerCase().startsWith(noPrefix) * 2
      aScore += a.name.toLowerCase().startsWith(noPrefix)
      bScore += b.screen_name.toLowerCase().startsWith(noPrefix) * 2
      bScore += b.name.toLowerCase().startsWith(noPrefix)

      const diff = bScore * 10 - aScore * 10
      const nameAlphabetically = a.name > b.name ? 1 : -1
      const screenNameAlphabetically = a.screen_name > b.screen_name ? 1 : -1

      return diff + nameAlphabetically + screenNameAlphabetically
    }).map(({ screen_name, name, profile_image_url_original }) => ({
      displayText: screen_name,
      detailText: name,
      imageUrl: profile_image_url_original,
      replacement: '@' + screen_name
    }))
    /* eslint-enable camelcase */
  }
}
