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
    ).map(({ screen_name, name, profile_image_url_original }) => ({
      displayText: screen_name,
      detailText: name,
      imageUrl: profile_image_url_original,
      replacement: '@' + screen_name
    }))
    /* eslint-enable camelcase */
  }
}
