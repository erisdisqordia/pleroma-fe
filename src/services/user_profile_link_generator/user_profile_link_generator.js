import { includes } from 'lodash'

const generateProfileLink = (id, screenName, restrictedNicknames) => {
  const complicated = (isExternal(screenName) || includes(restrictedNicknames, screenName))
  return {
    name: (complicated ? 'external-user-profile' : 'user-profile'),
    params: (complicated ? { id } : { name: screenName })
  }
}

const isExternal = screenName => screenName.includes('@')

export default generateProfileLink
