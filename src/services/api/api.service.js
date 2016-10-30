/* eslint-env browser */
const LOGIN_URL = '/api/account/verify_credentials.json'
const FRIENDS_TIMELINE_URL = '/api/statuses/friends_timeline.json'
const PUBLIC_TIMELINE_URL = '/api/statuses/public_timeline.json'
const PUBLIC_AND_EXTERNAL_TIMELINE_URL = '/api/statuses/public_and_external_timeline.json'
const FAVORITE_URL = '/api/favorites/create'
const UNFAVORITE_URL = '/api/favorites/destroy'
// const CONVERSATION_URL = '/api/statusnet/conversation/';
// const STATUS_UPDATE_URL = '/api/statuses/update.json';
// const MEDIA_UPLOAD_URL = '/api/statusnet/media/upload';

// const FORM_CONTENT_TYPE = {'Content-Type': 'application/x-www-form-urlencoded'};

// import { param, ajax } from 'jquery';
// import { merge } from 'lodash';

const authHeaders = (user) => ({ 'Authorization': `Basic ${btoa(`${user.username}:${user.password}`)}` })

const fetchTimeline = ({timeline, credentials, since = false, until = false}) => {
  const timelineUrls = {
    public: PUBLIC_TIMELINE_URL,
    friends: FRIENDS_TIMELINE_URL,
    'public-and-external': PUBLIC_AND_EXTERNAL_TIMELINE_URL
  }

  let url = timelineUrls[timeline]

  if (since) {
    url += `?since_id=${since}`
  }

  if (until) {
    url += `?max_id=${until}`
  }

  return fetch(url, { headers: authHeaders(credentials) }).then((data) => data.json())
}

const verifyCredentials = (user) => {
  return fetch(LOGIN_URL, {
    method: 'POST',
    headers: authHeaders(user)
  })
}

const favorite = ({ id, credentials }) => {
  return fetch(`${FAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unfavorite = ({ id, credentials }) => {
  return fetch(`${UNFAVORITE_URL}/${id}.json`, {
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  favorite,
  unfavorite
}

export default apiService

// // TODO: This should probably be in redux.
// let authHeaders = {};

// const apiServiceFactory = ($http) => {
//   // Public
//   const fetchConversation = (id) => {
//     return $http.get(`${CONVERSATION_URL}/${id}.json?count=100`);
//   };

//   const fetchTimeline = ({timeline, since = false, until = false}) => {
//     const timelineUrls = {
//       public: PUBLIC_TIMELINE_URL,
//       friends: FRIENDS_TIMELINE_URL,
//       'public-and-external': PUBLIC_AND_EXTERNAL_TIMELINE_URL
//     };

//     let url = timelineUrls[timeline];

//     if(since) {
//       url += `?since_id=${since}`;
//     }

//     if(until) {
//       url += `?max_id=${until}`;
//     }

//     return fetch(url, { headers: authHeaders }).then((data) => data.json());
//   };

//   // Need credentials
//   const verifyCredentials = (user) => {
//     const base64 = btoa(`${user.username}:${user.password}`);
//     authHeaders = { "Authorization": `Basic ${base64}` };
//     return $http.post(LOGIN_URL, null, { headers: authHeaders });
//   };

//   const postStatus = ({status, mediaIds, in_reply_to_status_id}) => {
//     const idsText = mediaIds.join(',');
//     const form = new FormData();

//     form.append('status', status);
//     form.append('source', 'The Wired FE');
//     form.append('media_ids', idsText);
//     if(in_reply_to_status_id) {
//       form.append('in_reply_to_status_id', in_reply_to_status_id);
//     };

//     return fetch(STATUS_UPDATE_URL, {
//       body: form,
//       method: 'POST',
//       headers: authHeaders
//     });
//   };

//   const unfavorite = (id) => $http.post(`${UNFAVORITE_URL}/${id}.json`, null, {headers: authHeaders});

//   // This was impossible to get to work with $http. You're supposed to set Content-Type
//   // undefined in the header so it sends the correct header. It would always send a json
//   // content type. This method from jQuery worked right away...
//   // Also, this method is only available as XML output. OLOLOLOLO
//   const uploadMedia = (formData) => ajax({
//     url: MEDIA_UPLOAD_URL,
//     data: formData,
//     type: 'POST',
//     processData: false,
//     contentType: false,
//     headers: authHeaders
//   });

//   const apiService = {
//     verifyCredentials,
//     fetchConversation,
//     postStatus,
//     uploadMedia,
//     favorite,
//     unfavorite,
//     fetchTimeline
//   };

//   return apiService;
// };

// apiServiceFactory.$inject = ['$http'];

// export default apiServiceFactory;
