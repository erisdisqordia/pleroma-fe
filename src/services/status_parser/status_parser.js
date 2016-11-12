import sanitize from 'sanitize-html'

export const removeAttachmentLinks = (html) => {
  return sanitize(html, {
    allowedTags: false,
    allowedAttributes: false,
    exclusiveFilter: ({ tag, attribs: { class: klass } }) => tag === 'a' && klass.match(/attachment/)
  })
}

export const parse = (html) => {
  return removeAttachmentLinks(html)
}

export default parse
