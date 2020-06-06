import { filter } from 'lodash'
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

export const muteWordHits = (status, muteWords) => {
  const statusText = status.text.toLowerCase()
  const statusSummary = status.summary.toLowerCase()
  const hits = filter(muteWords, (muteWord) => {
    return statusText.includes(muteWord.toLowerCase()) || statusSummary.includes(muteWord.toLowerCase())
  })

  return hits
}

export default parse
