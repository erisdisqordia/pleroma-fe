import { map } from 'lodash'
import apiService from '../api/api.service.js'

const postStatus = ({ store, status, media = [], inReplyToStatusId = undefined }) => {
  const mediaIds = map(media, 'id')

  return apiService.postStatus({credentials: store.state.users.currentUser.credentials, status, mediaIds, inReplyToStatusId})
    .then((data) => data.json())
    .then((data) => {
      store.dispatch('addNewStatuses',
        { statuses: [data], timeline: 'friends', showImmediately: true })
    })
}

const uploadMedia = ({ store, formData }) => {
  const credentials = store.state.users.currentUser.credentials

  return apiService.uploadMedia({ credentials, formData }).then((xml) => {
    return {
      id: xml.getElementsByTagName('media_id')[0].textContent,
      url: xml.getElementsByTagName('media_url')[0].textContent,
      image: xml.getElementsByTagName('atom:link')[0].getAttribute('href'),
      mimetype: xml.getElementsByTagName('atom:link')[0].getAttribute('type')
    }
  })
}

const statusPosterService = {
  postStatus,
  uploadMedia
}

export default statusPosterService
