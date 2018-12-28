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
    'attentions',
    'copyMessageScope',
    'subject'
  ],
  components: {
    MediaUpload
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

    const scope = (this.copyMessageScope && scopeCopy || this.copyMessageScope === 'direct')
          ? this.copyMessageScope
          : this.$store.state.users.currentUser.default_scope

    return {
      dropFiles: [],
      submitDisabled: false,
      error: null,
      posting: false,
      highlighted: 0,
      newStatus: {
        spoilerText: this.subject || '',
        status: statusText,
        contentType: 'text/plain',
        nsfw: false,
        files: [],
        visibility: scope
      },
      caret: 0
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
    candidates () {
      const firstchar = this.textAtCaret.charAt(0)
      if (firstchar === '@') {
        const query = this.textAtCaret.slice(1).toUpperCase()
        const matchedUsers = filter(this.users, (user) => {
          return user.screen_name.toUpperCase().startsWith(query) ||
            user.name && user.name.toUpperCase().startsWith(query)
        })
        if (matchedUsers.length <= 0) {
          return false
        }
        // eslint-disable-next-line camelcase
        return map(take(matchedUsers, 5), ({screen_name, name, profile_image_url_original}, index) => ({
          // eslint-disable-next-line camelcase
          screen_name: `@${screen_name}`,
          name: name,
          img: profile_image_url_original,
          highlighted: index === this.highlighted
        }))
      } else if (firstchar === ':') {
        if (this.textAtCaret === ':') { return }
        const matchedEmoji = filter(this.emoji.concat(this.customEmoji), (emoji) => emoji.shortcode.startsWith(this.textAtCaret.slice(1)))
        if (matchedEmoji.length <= 0) {
          return false
        }
        return map(take(matchedEmoji, 5), ({shortcode, image_url, utf}, index) => ({
          screen_name: `:${shortcode}:`,
          name: '',
          utf: utf || '',
          // eslint-disable-next-line camelcase
          img: utf ? '' : this.$store.state.instance.server + image_url,
          highlighted: index === this.highlighted
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
    }
  },
  methods: {
    replace (replacement) {
      this.newStatus.status = Completion.replaceWord(this.newStatus.status, this.wordAtCaret, replacement)
      const el = this.$el.querySelector('textarea')
      el.focus()
      this.caret = 0
    },
    replaceCandidate (e) {
      const len = this.candidates.length || 0
      if (this.textAtCaret === ':' || e.ctrlKey) { return }
      if (len > 0) {
        e.preventDefault()
        const candidate = this.candidates[this.highlighted]
        const replacement = candidate.utf || (candidate.screen_name + ' ')
        this.newStatus.status = Completion.replaceWord(this.newStatus.status, this.wordAtCaret, replacement)
        const el = this.$el.querySelector('textarea')
        el.focus()
        this.caret = 0
        this.highlighted = 0
      }
    },
    cycleBackward (e) {
      const len = this.candidates.length || 0
      if (len > 0) {
        e.preventDefault()
        this.highlighted -= 1
        if (this.highlighted < 0) {
          this.highlighted = this.candidates.length - 1
        }
      } else {
        this.highlighted = 0
      }
    },
    cycleForward (e) {
      const len = this.candidates.length || 0
      if (len > 0) {
        if (e.shiftKey) { return }
        e.preventDefault()
        this.highlighted += 1
        if (this.highlighted >= len) {
          this.highlighted = 0
        }
      } else {
        this.highlighted = 0
      }
    },
    setCaret ({target: {selectionStart}}) {
      this.caret = selectionStart
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
    }
  }
}

export default PostStatusForm
