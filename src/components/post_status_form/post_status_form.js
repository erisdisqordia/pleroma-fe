import statusPoster from '../../services/status_poster/status_poster.service.js'
import MediaUpload from '../media_upload/media_upload.vue'
import ScopeSelector from '../scope_selector/scope_selector.vue'
import EmojiInput from '../emoji_input/emoji_input.vue'
import PollForm from '../poll/poll_form.vue'
import Attachment from '../attachment/attachment.vue'
import StatusContent from '../status_content/status_content.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'
import { findOffset } from '../../services/offset_finder/offset_finder.service.js'
import { reject, map, uniqBy, debounce } from 'lodash'
import suggestor from '../emoji_input/suggestor.js'
import { mapGetters } from 'vuex'
import Checkbox from '../checkbox/checkbox.vue'

const buildMentionsString = ({ user, attentions = [] }, currentUser) => {
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
    ScopeSelector,
    Checkbox,
    Attachment,
    StatusContent
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

    const { scopeCopy } = this.$store.getters.mergedConfig

    if (this.replyTo) {
      const currentUser = this.$store.state.users.currentUser
      statusText = buildMentionsString({ user: this.repliedUser, attentions: this.attentions }, currentUser)
    }

    const scope = ((this.copyMessageScope && scopeCopy) || this.copyMessageScope === 'direct')
      ? this.copyMessageScope
      : this.$store.state.users.currentUser.default_scope

    const { postContentType: contentType } = this.$store.getters.mergedConfig

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
        mediaDescriptions: {},
        visibility: scope,
        contentType
      },
      caret: 0,
      pollFormVisible: false,
      showDropIcon: 'hide',
      dropStopTimeout: null,
      preview: null,
      previewLoading: false
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
      return !this.mergedConfig.minimalScopesMode
    },
    emojiUserSuggestor () {
      return suggestor({
        emoji: [
          ...this.$store.state.instance.emoji,
          ...this.$store.state.instance.customEmoji
        ],
        users: this.$store.state.users.users,
        updateUsersList: (query) => this.$store.dispatch('searchUsers', { query })
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
      return this.mergedConfig.alwaysShowSubjectInput
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
      return this.$store.getters.mergedConfig.hideScopeNotice
    },
    pollContentError () {
      return this.pollFormVisible &&
        this.newStatus.poll &&
        this.newStatus.poll.error
    },
    showPreview () {
      return !!this.preview || this.previewLoading
    },
    emptyStatus () {
      return this.newStatus.status.trim() === '' && this.newStatus.files.length === 0
    },
    ...mapGetters(['mergedConfig'])
  },
  watch: {
    'newStatus.contentType': function () {
      this.autoPreview()
    },
    'newStatus.spoilerText': function () {
      this.autoPreview()
    }
  },
  methods: {
    async postStatus (newStatus) {
      if (this.posting) { return }
      if (this.submitDisabled) { return }
      if (this.emptyStatus) {
        this.error = this.$t('post_status.empty_status_error')
        return
      }

      const poll = this.pollFormVisible ? this.newStatus.poll : {}
      if (this.pollContentError) {
        this.error = this.pollContentError
        return
      }

      this.posting = true

      try {
        await this.setAllMediaDescriptions()
      } catch (e) {
        this.error = this.$t('post_status.media_description_error')
        this.posting = false
        return
      }

      const data = await statusPoster.postStatus({
        status: newStatus.status,
        spoilerText: newStatus.spoilerText || null,
        visibility: newStatus.visibility,
        sensitive: newStatus.nsfw,
        media: newStatus.files,
        store: this.$store,
        inReplyToStatusId: this.replyTo,
        contentType: newStatus.contentType,
        poll
      })

      if (!data.error) {
        this.newStatus = {
          status: '',
          spoilerText: '',
          files: [],
          visibility: newStatus.visibility,
          contentType: newStatus.contentType,
          poll: {},
          mediaDescriptions: {}
        }
        this.pollFormVisible = false
        this.$refs.mediaUpload.clearFile()
        this.clearPollForm()
        this.$emit('posted')
        let el = this.$el.querySelector('textarea')
        el.style.height = 'auto'
        el.style.height = undefined
        this.error = null
        if (this.preview) this.previewStatus()
      } else {
        this.error = data.error
      }

      this.posting = false
    },
    previewStatus () {
      if (this.emptyStatus && this.newStatus.spoilerText.trim() === '') {
        this.preview = { error: this.$t('post_status.preview_empty') }
        this.previewLoading = false
        return
      }
      const newStatus = this.newStatus
      this.previewLoading = true
      statusPoster.postStatus({
        status: newStatus.status,
        spoilerText: newStatus.spoilerText || null,
        visibility: newStatus.visibility,
        sensitive: newStatus.nsfw,
        media: [],
        store: this.$store,
        inReplyToStatusId: this.replyTo,
        contentType: newStatus.contentType,
        poll: {},
        preview: true
      }).then((data) => {
        // Don't apply preview if not loading, because it means
        // user has closed the preview manually.
        if (!this.previewLoading) return
        if (!data.error) {
          this.preview = data
        } else {
          this.preview = { error: data.error }
        }
      }).catch((error) => {
        this.preview = { error }
      }).finally(() => {
        this.previewLoading = false
      })
    },
    debouncePreviewStatus: debounce(function () { this.previewStatus() }, 500),
    autoPreview () {
      if (!this.preview) return
      this.previewLoading = true
      this.debouncePreviewStatus()
    },
    closePreview () {
      this.preview = null
      this.previewLoading = false
    },
    togglePreview () {
      if (this.showPreview) {
        this.closePreview()
      } else {
        this.previewStatus()
      }
    },
    addMediaFile (fileInfo) {
      this.newStatus.files.push(fileInfo)
    },
    removeMediaFile (fileInfo) {
      let index = this.newStatus.files.indexOf(fileInfo)
      this.newStatus.files.splice(index, 1)
    },
    uploadFailed (errString, templateArgs) {
      templateArgs = templateArgs || {}
      this.error = this.$t('upload.error.base') + ' ' + this.$t('upload.error.' + errString, templateArgs)
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
      this.autoPreview()
      this.resize(e)
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
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        e.preventDefault() // allow dropping text like before
        this.dropFiles = e.dataTransfer.files
        clearTimeout(this.dropStopTimeout)
        this.showDropIcon = 'hide'
      }
    },
    fileDragStop (e) {
      // The false-setting is done with delay because just using leave-events
      // directly caused unwanted flickering, this is not perfect either but
      // much less noticable.
      clearTimeout(this.dropStopTimeout)
      this.showDropIcon = 'fade'
      this.dropStopTimeout = setTimeout(() => (this.showDropIcon = 'hide'), 500)
    },
    fileDrag (e) {
      e.dataTransfer.dropEffect = 'copy'
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        clearTimeout(this.dropStopTimeout)
        this.showDropIcon = 'show'
      }
    },
    onEmojiInputInput (e) {
      this.autoPreview()
      this.$nextTick(() => {
        this.resize(this.$refs['textarea'])
      })
    },
    resize (e) {
      const target = e.target || e
      if (!(target instanceof window.Element)) { return }

      // Reset to default height for empty form, nothing else to do here.
      if (target.value === '') {
        target.style.height = null
        this.$refs['emoji-input'].resize()
        return
      }

      const formRef = this.$refs['form']
      const bottomRef = this.$refs['bottom']
      /* Scroller is either `window` (replies in TL), sidebar (main post form,
       * replies in notifs) or mobile post form. Note that getting and setting
       * scroll is different for `Window` and `Element`s
       */
      const bottomBottomPaddingStr = window.getComputedStyle(bottomRef)['padding-bottom']
      const bottomBottomPadding = Number(bottomBottomPaddingStr.substring(0, bottomBottomPaddingStr.length - 2))

      const scrollerRef = this.$el.closest('.sidebar-scroller') ||
            this.$el.closest('.post-form-modal-view') ||
            window

      // Getting info about padding we have to account for, removing 'px' part
      const topPaddingStr = window.getComputedStyle(target)['padding-top']
      const bottomPaddingStr = window.getComputedStyle(target)['padding-bottom']
      const topPadding = Number(topPaddingStr.substring(0, topPaddingStr.length - 2))
      const bottomPadding = Number(bottomPaddingStr.substring(0, bottomPaddingStr.length - 2))
      const vertPadding = topPadding + bottomPadding

      /* Explanation:
       *
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight
       * scrollHeight returns element's scrollable content height, i.e. visible
       * element + overscrolled parts of it. We use it to determine when text
       * inside the textarea exceeded its height, so we can set height to prevent
       * overscroll, i.e. make textarea grow with the text. HOWEVER, since we
       * explicitly set new height, scrollHeight won't go below that, so we can't
       * SHRINK the textarea when there's extra space. To workaround that we set
       * height to 'auto' which makes textarea tiny again, so that scrollHeight
       * will match text height again. HOWEVER, shrinking textarea can screw with
       * the scroll since there might be not enough padding around form-bottom to even
       * warrant a scroll, so it will jump to 0 and refuse to move anywhere,
       * so we check current scroll position before shrinking and then restore it
       * with needed delta.
       */

      // this part has to be BEFORE the content size update
      const currentScroll = scrollerRef === window
        ? scrollerRef.scrollY
        : scrollerRef.scrollTop
      const scrollerHeight = scrollerRef === window
        ? scrollerRef.innerHeight
        : scrollerRef.offsetHeight
      const scrollerBottomBorder = currentScroll + scrollerHeight

      // BEGIN content size update
      target.style.height = 'auto'
      const newHeight = target.scrollHeight - vertPadding
      target.style.height = `${newHeight}px`
      // END content size update

      // We check where the bottom border of form-bottom element is, this uses findOffset
      // to find offset relative to scrollable container (scroller)
      const bottomBottomBorder = bottomRef.offsetHeight + findOffset(bottomRef, scrollerRef).top + bottomBottomPadding

      const isBottomObstructed = scrollerBottomBorder < bottomBottomBorder
      const isFormBiggerThanScroller = scrollerHeight < formRef.offsetHeight
      const bottomChangeDelta = bottomBottomBorder - scrollerBottomBorder
      // The intention is basically this;
      // Keep form-bottom always visible so that submit button is in view EXCEPT
      // if form element bigger than scroller and caret isn't at the end, so that
      // if you scroll up and edit middle of text you won't get scrolled back to bottom
      const shouldScrollToBottom = isBottomObstructed &&
            !(isFormBiggerThanScroller &&
              this.$refs.textarea.selectionStart !== this.$refs.textarea.value.length)
      const totalDelta = shouldScrollToBottom ? bottomChangeDelta : 0
      const targetScroll = currentScroll + totalDelta

      if (scrollerRef === window) {
        scrollerRef.scroll(0, targetScroll)
      } else {
        scrollerRef.scrollTop = targetScroll
      }

      this.$refs['emoji-input'].resize()
    },
    showEmojiPicker () {
      this.$refs['textarea'].focus()
      this.$refs['emoji-input'].triggerShowPicker()
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
    },
    setMediaDescription (id) {
      const description = this.newStatus.mediaDescriptions[id]
      if (!description || description.trim() === '') return
      return statusPoster.setMediaDescription({ store: this.$store, id, description })
    },
    setAllMediaDescriptions () {
      const ids = this.newStatus.files.map(file => file.id)
      return Promise.all(ids.map(id => this.setMediaDescription(id)))
    }
  }
}

export default PostStatusForm
