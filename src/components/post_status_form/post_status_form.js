import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'

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
    'attentions',
    'submitDisabled'
  ],
  components: {
    MediaUpload
  },
  data () {
    this.submitDisabled = false
    let statusText = ''

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    return {
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
    disableSubmit () {
      this.submitDisabled = true
    },
    enableSubmit () {
      this.submitDisabled = false
    }
  }
}

export default PostStatusForm
