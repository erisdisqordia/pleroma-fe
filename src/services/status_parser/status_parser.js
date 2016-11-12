import sanitize from 'sanitize-html'

export const removeAttachmentLinks = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
    exclusiveFilter: ({ tag, attribs }) => tag === 'a' && typeof attribs.class === 'string' && attribs.class.match(/attachment/)
  })
}

export const parse = (html) => {
  return removeAttachmentLinks(html)
}

export default parse
