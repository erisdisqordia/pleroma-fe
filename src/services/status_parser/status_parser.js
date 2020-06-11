import { filter } from 'lodash'

export const muteWordHits = (status, muteWords) => {
  const statusText = status.text.toLowerCase()
  const statusSummary = status.summary.toLowerCase()
  const hits = filter(muteWords, (muteWord) => {
    return statusText.includes(muteWord.toLowerCase()) || statusSummary.includes(muteWord.toLowerCase())
  })

  return hits
}
