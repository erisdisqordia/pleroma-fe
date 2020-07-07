import { map } from 'lodash'
import apiService from '../api/api.service.js'

const postStatus = ({
  store,
  status,
  spoilerText,
  visibility,
  sensitive,
  poll,
  media = [],
  inReplyToStatusId = undefined,
  contentType = 'text/plain',
  preview = false
}) => {
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
    poll,
    preview
  })
    .then((data) => {
      if (!data.error && !preview) {
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

const setMediaDescription = ({ store, id, description }) => {
  const credentials = store.state.users.currentUser.credentials
  return apiService.setMediaDescription({ credentials, id, description })
}

const statusPosterService = {
  postStatus,
  uploadMedia,
  setMediaDescription
}

export default statusPosterService
