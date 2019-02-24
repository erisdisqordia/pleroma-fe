// Generate url based on template
// Example: /api/v1/accounts/:id/mute -> /api/v1/accounts/123/mute
export const generateUrl = (template, params = {}) => {
  let url = template
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(':' + key, value)
  })
  return url
}
