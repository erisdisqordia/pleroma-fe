
export const extractCommit = versionString => {
  const regex = /-g(\w+)/i
  const matches = versionString.match(regex)
  return matches ? matches[1] : ''
}
