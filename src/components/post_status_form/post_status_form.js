import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'

import { reject, map, uniqBy } from 'lodash'

const buildMentionsString = ({user, attentions}, currentUser) => {
  let allAttentions = [...attentions]

  allAttentions.unshift(user)

  allAttentions = uniqBy(allAttentions, 'id')
  allAttentions = reject(allAttentions, {id: currentUser.id})

  let mentions = map(allAttentions, (attention) => {
    return `@${attention.screen_name}`
  })

  return mentions.join(' ') + ' '
}

const PostStatusForm = {
  props: [
    'replyTo',
    'repliedUser',
    'attentions'
  ],
  components: {
    MediaUpload
  },
  data () {
    let statusText = ''

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    return {
      submitDisabled: false,
      newStatus: {
        status: statusText,
        files: []
      }
    }
  },
  methods: {
    postStatus (newStatus) {
      statusPoster.postStatus({
        status: newStatus.status,
        media: newStatus.files,
        store: this.$store,
        inReplyToStatusId: this.replyTo
      })
      this.newStatus = {
        status: '',
        files: []
      }
      this.$emit('posted')
    },
    addMediaFile (fileInfo) {
      this.newStatus.files.push(fileInfo)
      this.enableSubmit()
    },
    removeMediaFile (fileInfo) {
      let index = this.newStatus.files.indexOf(fileInfo)
      this.newStatus.files.splice(index, 1)
    },
    disableSubmit () {
      this.submitDisabled = true
    },
    enableSubmit () {
      this.submitDisabled = false
    },
    type (fileInfo) {
      return fileTypeService.fileType(fileInfo.mimetype)
    }
  }
}

export default PostStatusForm
