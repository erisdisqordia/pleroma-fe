import { map } from 'lodash'
import apiService from '../api/api.service.js'

const postStatus = ({ store, status, media = [], inReplyToStatusId = undefined }) => {
  const mediaIds = map(media, 'id')

  return apiService.postStatus({credentials: store.state.users.currentUser.credentials, status, mediaIds, inReplyToStatusId})
    .then((data) => data.json())
    .then((data) => {
      if (!data.error) {
        store.dispatch('addNewStatuses', {
          statuses: [data],
          timeline: 'friends',
          showImmediately: true,
          noIdUpdate: true // To prevent missing notices on next pull.
        })
      }
      return data
    })
}

const uploadMedia = ({ store, formData }) => {
  const credentials = store.state.users.currentUser.credentials

  return apiService.uploadMedia({ credentials, formData }).then((xml) => {
    // Firefox and Chrome treat method differently...
    let link = xml.getElementsByTagName('link')

    if (link.length === 0) {
      link = xml.getElementsByTagName('atom:link')
    }

    link = link[0]

    const mediaData = {
      id: xml.getElementsByTagName('media_id')[0].textContent,
      url: xml.getElementsByTagName('media_url')[0].textContent,
      image: link.getAttribute('href'),
      mimetype: link.getAttribute('type')
    }

    return mediaData
  })
}

const statusPosterService = {
  postStatus,
  uploadMedia
}

export default statusPosterService
