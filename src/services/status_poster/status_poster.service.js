import { map } from 'lodash'
import apiService from '../api/api.service.js'

const postStatus = ({ store, status, media = [], inReplyToStatusId = undefined }) => {
  const mediaIds = map(media, 'id')

  return apiService.postStatus({credentials: store.state.users.currentUser.credentials, status, mediaIds, inReplyToStatusId})
    .then((data) => data.json())
    .then((data) => {
      store.commit('addNewStatuses',
        { statuses: [data], timeline: 'friends', showImmediately: true })
    })
}

const statusPosterService = {
  postStatus
}

export default statusPosterService

// const statusPosterServiceFactory = (apiService, $ngRedux) => {
//   const postStatus = ({status, media = [], in_reply_to_status_id = undefined}) => {
//     const mediaIds = map(media, 'id');

//     return apiService.postStatus({status, mediaIds, in_reply_to_status_id}).
//       then((data) => data.json()).
//       then((data) => {
//         $ngRedux.dispatch({type: 'ADD_NEW_STATUSES', data: { statuses: [data], timeline: 'friends', showImmediately: true }});
//       });
//   };

//   const uploadMedia = (formData) => {
//     return apiService.uploadMedia(formData).then((xml) => {
//       return {
//         id: xml.getElementsByTagName('media_id')[0].textContent,
//         url: xml.getElementsByTagName('media_url')[0].textContent,
//         image: xml.getElementsByTagName('atom:link')[0].getAttribute('href')
//       };
//     });
//   };

//   const statusPosterService = {
//     postStatus,
//     uploadMedia
//   };

//   return statusPosterService;
// };

// statusPosterServiceFactory.$inject = ['apiService', '$ngRedux'];

// export default statusPosterServiceFactory;
