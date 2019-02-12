import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import AutoCompleteInput from '../autocomplete_input/autocomplete_input.vue'
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

  return mentions.length > 0 ? mentions.join(' ') + ' ' : ''
}

const PostStatusForm = {
  props: [
    'replyTo',
    'repliedUser',
    'attentions',
    'copyMessageScope',
    'subject'
  ],
  components: {
    MediaUpload,
    AutoCompleteInput
  },
  mounted () {
    if (this.replyTo) {
      this.$refs.textarea.focus()
    }
  },
  data () {
    const preset = this.$route.query.message
    let statusText = preset || ''

    const scopeCopy = typeof this.$store.state.config.scopeCopy === 'undefined'
          ? this.$store.state.instance.scopeCopy
          : this.$store.state.config.scopeCopy

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    const scope = (this.copyMessageScope && scopeCopy || this.copyMessageScope === 'direct')
          ? this.copyMessageScope
          : this.$store.state.users.currentUser.default_scope

    return {
      dropFiles: [],
      submitDisabled: false,
      error: null,
      posting: false,
      newStatus: {
        spoilerText: this.subject || '',
        status: statusText,
        nsfw: false,
        files: [],
        visibility: scope
      }
    }
  },
  computed: {
    vis () {
      return {
        public: { selected: this.newStatus.visibility === 'public' },
        unlisted: { selected: this.newStatus.visibility === 'unlisted' },
        private: { selected: this.newStatus.visibility === 'private' },
        direct: { selected: this.newStatus.visibility === 'direct' }
      }
    },
    statusLength () {
      return this.newStatus.status.length
    },
    spoilerTextLength () {
      return this.newStatus.spoilerText.length
    },
    statusLengthLimit () {
      return this.$store.state.instance.textlimit
    },
    hasStatusLengthLimit () {
      return this.statusLengthLimit > 0
    },
    charactersLeft () {
      return this.statusLengthLimit - (this.statusLength + this.spoilerTextLength)
    },
    isOverLengthLimit () {
      return this.hasStatusLengthLimit && (this.charactersLeft < 0)
    },
    scopeOptionsEnabled () {
      return this.$store.state.instance.scopeOptionsEnabled
    },
    alwaysShowSubject () {
      if (typeof this.$store.state.config.alwaysShowSubjectInput !== 'undefined') {
        return this.$store.state.config.alwaysShowSubjectInput
      } else if (typeof this.$store.state.instance.alwaysShowSubjectInput !== 'undefined') {
        return this.$store.state.instance.alwaysShowSubjectInput
      } else {
        return this.$store.state.instance.scopeOptionsEnabled
      }
    },
    formattingOptionsEnabled () {
      return this.$store.state.instance.formattingOptionsEnabled
    },
    defaultPostContentType () {
      return typeof this.$store.state.config.postContentType === 'undefined'
        ? this.$store.state.instance.postContentType
        : this.$store.state.config.postContentType
    }
  },
  methods: {
    postStatusCopy () {
      this.postStatus(this.newStatus)
    },
    postStatus (newStatus) {
      if (this.posting) { return }
      if (this.submitDisabled) { return }

      if (this.newStatus.status === '') {
        if (this.newStatus.files.length > 0) {
          this.newStatus.status = '\u200b' // hack
        } else {
          this.error = 'Cannot post an empty status with no files'
          return
        }
      }

      this.posting = true
      statusPoster.postStatus({
        status: newStatus.status,
        spoilerText: newStatus.spoilerText || null,
        visibility: newStatus.visibility,
        sensitive: newStatus.nsfw,
        media: newStatus.files,
        store: this.$store,
        inReplyToStatusId: this.replyTo,
        contentType: newStatus.contentType
      }).then((data) => {
        if (!data.error) {
          this.newStatus = {
            status: '',
            spoilerText: '',
            files: [],
            visibility: newStatus.visibility,
            contentType: newStatus.contentType
          }
          this.$refs.mediaUpload.clearFile()
          this.$emit('posted')
          let el = this.$el.querySelector('textarea')
          el.style.height = 'auto'
          el.style.height = undefined
          this.error = null
        } else {
          this.error = data.error
        }
        this.posting = false
      })
    },
    addMediaFile (fileInfo) {
      this.newStatus.files.push(fileInfo)
      this.enableSubmit()
    },
    removeMediaFile (fileInfo) {
      let index = this.newStatus.files.indexOf(fileInfo)
      this.newStatus.files.splice(index, 1)
    },
    uploadFailed (errString, templateArgs) {
      templateArgs = templateArgs || {}
      this.error = this.$t('upload.error.base') + ' ' + this.$t('upload.error.' + errString, templateArgs)
      this.enableSubmit()
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
    paste (e) {
      if (e.clipboardData.files.length > 0) {
        // Strangely, files property gets emptied after event propagation
        // Trying to wrap it in array doesn't work. Plus I doubt it's possible
        // to hold more than one file in clipboard.
        this.dropFiles = [e.clipboardData.files[0]]
      }
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
    clearError () {
      this.error = null
    },
    changeVis (visibility) {
      this.newStatus.visibility = visibility
    }
  }
}

export default PostStatusForm
