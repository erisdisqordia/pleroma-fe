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
    const shortcode = input.toLowerCase().substr(1)
    console.log(shortcode)
    return emojis.filter(emoji => emoji.shortcode.toLowerCase().startsWith(shortcode))
  }
}

function suggestUsers (users) {
  return input => {
    const shortcode = input.toLowerCase().substr(1)
    return users.filter(
      user =>
        user.screen_name.toLowerCase().startsWith('@' + shortcode) ||
        user.name.toLowerCase().startsWith(shortcode)
    ).map(({ screen_name, name, profile_image_url_original }) => ({
      shortcode: screen_name,
      detail: name,
      image_url: profile_image_url_original,
      replacement: '@' + screen_name
    }))
  }
}
