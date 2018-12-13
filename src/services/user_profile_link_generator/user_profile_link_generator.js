const generateProfileLink = (id, screenName) => {
  return {
    name: 'user-profile',
    params: (isExternal(screenName) ? { id } : { name: screenName })
  }
}

const isExternal = screenName => screenName.includes('@')

export default generateProfileLink
