const generateProfileLink = (id, screenName) => {
  return {
    name: (isExternal(screenName) ? 'external-user-profile' : 'user-profile'),
    params: (isExternal(screenName) ? { id } : { name: screenName })
  }
}

const isExternal = screenName => screenName.includes('@')

export default generateProfileLink
