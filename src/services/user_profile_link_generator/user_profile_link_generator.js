const generateProfileLink = (user, name = '') => {
  const baseLinkParams = { name: 'user-profile' }
  const { id } = user

  return { ...baseLinkParams, params: (isExternal(user) ? { id } : { name }) }
}

const isExternal = ({screen_name}) => (screen_name.indexOf('@') > -1)

export default generateProfileLink
