import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'
import Completion from '../../services/completion/completion.js'
import { take, filter, reject, map, uniqBy } from 'lodash'

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
      dropFiles: [],
      submitDisabled: false,
      newStatus: {
        status: statusText,
        files: []
      },
      caret: 0
    }
  },
  computed: {
    candidates () {
      if (this.textAtCaret.charAt(0) === '@') {
        const matchedUsers = filter(this.users, (user) => (user.name + user.screen_name).match(this.textAtCaret.slice(1)))
        if (matchedUsers.length <= 0) {
          return false
        }
        // eslint-disable-next-line camelcase
        return map(take(matchedUsers, 5), ({screen_name, name, profile_image_url_original}) => ({
          screen_name: screen_name,
          name: name,
          img: profile_image_url_original
        }))
      } else {
        return false
      }
    },
    textAtCaret () {
      return (this.wordAtCaret || {}).word || ''
    },
    wordAtCaret () {
      const word = Completion.wordAtPosition(this.newStatus.status, this.caret - 1) || {}
      return word
    },
    users () {
      return this.$store.state.users.users
    }
  },
  methods: {
    replace (replacement) {
      this.newStatus.status = Completion.replaceWord(this.newStatus.status, this.wordAtCaret, replacement)
      const el = this.$el.querySelector('textarea')
      el.focus()
      this.caret = 0
    },
    setCaret ({target: {selectionStart}}) {
      this.caret = selectionStart
    },
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
      let el = this.$el.querySelector('textarea')
      el.style.height = '16px'
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
    },
    fileDrop (e) {
      if (e.dataTransfer.files.length > 0) {
        e.preventDefault()  // allow dropping text like before
        this.dropFiles = e.dataTransfer.files
      }
    },
    fileDrag (e) {
      e.dataTransfer.dropEffect = 'copy'
    },
    resize (e) {
      e.target.style.height = 'auto'
      e.target.style.height = `${e.target.scrollHeight - 10}px`
      if (e.target.value === '') {
        e.target.style.height = '16px'
      }
    }
  }
}

export default PostStatusForm
