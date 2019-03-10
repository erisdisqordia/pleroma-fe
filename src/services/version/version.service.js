
export const parseBackendVersionString = versionString => {
  const regex = /(-g)(\w+)$/i
  const replacer = '$1<a href="https://git.pleroma.social/pleroma/pleroma/commit/$2" target="_blank">$2</a>'
  return versionString.replace(regex, replacer)
}

export const parseFrontendVersionString = versionString => {
  return `<a href="https://git.pleroma.social/pleroma/pleroma-fe/commit/${versionString}" target="_blank">#${versionString}</a>`
}
