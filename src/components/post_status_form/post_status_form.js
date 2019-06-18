import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import ScopeSelector from '../scope_selector/scope_selector.vue'
import EmojiInput from '../emoji-input/emoji-input.vue'
import PollForm from '../poll/poll_form.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'
import { reject, map, uniqBy } from 'lodash'
import suggestor from '../emoji-input/suggestor.js'

const buildMentionsString = ({ user, attentions }, currentUser) => {
  let allAttentions = [...attentions]

  allAttentions.unshift(user)

  allAttentions = uniqBy(allAttentions, 'id')
  allAttentions = reject(allAttentions, { id: currentUser.id })

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
    EmojiInput,
    PollForm,
    ScopeSelector
  },
  mounted () {
    this.resize(this.$refs.textarea)
    const textLength = this.$refs.textarea.value.length
    this.$refs.textarea.setSelectionRange(textLength, textLength)

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

    const scope = ((this.copyMessageScope && scopeCopy) || this.copyMessageScope === 'direct')
      ? this.copyMessageScope
      : this.$store.state.users.currentUser.default_scope

    const contentType = typeof this.$store.state.config.postContentType === 'undefined'
      ? this.$store.state.instance.postContentType
      : this.$store.state.config.postContentType

    return {
      dropFiles: [],
      submitDisabled: false,
      error: null,
      posting: false,
      highlighted: 0,
      newStatus: {
        spoilerText: this.subject || '',
        status: statusText,
        nsfw: false,
        files: [],
        poll: {},
        visibility: scope,
        contentType
      },
      caret: 0,
      pollFormVisible: false
    }
  },
  computed: {
    users () {
      return this.$store.state.users.users
    },
    userDefaultScope () {
      return this.$store.state.users.currentUser.default_scope
    },
    showAllScopes () {
      const minimalScopesMode = typeof this.$store.state.config.minimalScopesMode === 'undefined'
        ? this.$store.state.instance.minimalScopesMode
        : this.$store.state.config.minimalScopesMode
      return !minimalScopesMode
    },
    emojiUserSuggestor () {
      return suggestor({
        emoji: [
          ...this.$store.state.instance.emoji,
          ...this.$store.state.instance.customEmoji
        ],
        users: this.$store.state.users.users
      })
    },
    emojiSuggestor () {
      return suggestor({
        emoji: [
          ...this.$store.state.instance.emoji,
          ...this.$store.state.instance.customEmoji
        ]
      })
    },
    emoji () {
      return this.$store.state.instance.emoji || []
    },
    customEmoji () {
      return this.$store.state.instance.customEmoji || []
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
    minimalScopesMode () {
      return this.$store.state.instance.minimalScopesMode
    },
    alwaysShowSubject () {
      if (typeof this.$store.state.config.alwaysShowSubjectInput !== 'undefined') {
        return this.$store.state.config.alwaysShowSubjectInput
      } else if (typeof this.$store.state.instance.alwaysShowSubjectInput !== 'undefined') {
        return this.$store.state.instance.alwaysShowSubjectInput
      } else {
        return true
      }
    },
    postFormats () {
      return this.$store.state.instance.postFormats || []
    },
    safeDMEnabled () {
      return this.$store.state.instance.safeDM
    },
    pollsAvailable () {
      return this.$store.state.instance.pollsAvailable &&
        this.$store.state.instance.pollLimits.max_options >= 2
    },
    hideScopeNotice () {
      return this.$store.state.config.hideScopeNotice
    },
    pollContentError () {
      return this.pollFormVisible &&
        this.newStatus.poll &&
        this.newStatus.poll.error
    }
  },
  methods: {
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

      const poll = this.pollFormVisible ? this.newStatus.poll : {}
      if (this.pollContentError) {
        this.error = this.pollContentError
        return
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
        contentType: newStatus.contentType,
        poll
      }).then((data) => {
        if (!data.error) {
          this.newStatus = {
            status: '',
            spoilerText: '',
            files: [],
            visibility: newStatus.visibility,
            contentType: newStatus.contentType,
            poll: {}
          }
          this.pollFormVisible = false
          this.$refs.mediaUpload.clearFile()
          this.clearPollForm()
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
        // prevent pasting of file as text
        e.preventDefault()
        // Strangely, files property gets emptied after event propagation
        // Trying to wrap it in array doesn't work. Plus I doubt it's possible
        // to hold more than one file in clipboard.
        this.dropFiles = [e.clipboardData.files[0]]
      }
    },
    fileDrop (e) {
      if (e.dataTransfer.files.length > 0) {
        e.preventDefault() // allow dropping text like before
        this.dropFiles = e.dataTransfer.files
      }
    },
    fileDrag (e) {
      e.dataTransfer.dropEffect = 'copy'
    },
    resize (e) {
      const target = e.target || e
      if (!(target instanceof window.Element)) { return }
      const vertPadding = Number(window.getComputedStyle(target)['padding-top'].substr(0, 1)) +
            Number(window.getComputedStyle(target)['padding-bottom'].substr(0, 1))
      // Auto is needed to make textbox shrink when removing lines
      target.style.height = 'auto'
      target.style.height = `${target.scrollHeight - vertPadding}px`
      if (target.value === '') {
        target.style.height = null
      }
    },
    clearError () {
      this.error = null
    },
    changeVis (visibility) {
      this.newStatus.visibility = visibility
    },
    togglePollForm () {
      this.pollFormVisible = !this.pollFormVisible
    },
    setPoll (poll) {
      this.newStatus.poll = poll
    },
    clearPollForm () {
      if (this.$refs.pollForm) {
        this.$refs.pollForm.clear()
      }
    },
    dismissScopeNotice () {
      this.$store.dispatch('setOption', { name: 'hideScopeNotice', value: true })
    }
  }
}

export default PostStatusForm
