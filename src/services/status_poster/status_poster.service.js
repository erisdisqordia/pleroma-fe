import { map } from 'lodash'
import apiService from '../api/api.service.js'

const postStatus = ({ store, status, spoilerText, visibility, sensitive, poll, media = [], inReplyToStatusId = undefined, contentType = 'text/plain' }) => {
  const mediaIds = map(media, 'id')

  return apiService.postStatus({
    credentials: store.state.users.currentUser.credentials,
    status,
    spoilerText,
    visibility,
    sensitive,
    mediaIds,
    inReplyToStatusId,
    contentType,
    poll})
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
    .catch((err) => {
      return {
        error: err.message
      }
    })
}

const uploadMedia = ({ store, formData }) => {
  const credentials = store.state.users.currentUser.credentials

  return apiService.uploadMedia({ credentials, formData })
}

const statusPosterService = {
  postStatus,
  uploadMedia
}

export default statusPosterService
