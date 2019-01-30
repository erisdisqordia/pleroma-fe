import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import DeleteButton from '../delete_button/delete_button.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'
import StillImage from '../still-image/still-image.vue'
import Gallery from '../gallery/gallery.vue'
import LinkPreview from '../link-preview/link-preview.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import fileType from 'src/services/file_type/file_type.service'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'
import { mentionMatchesUrl } from 'src/services/mention_matcher/mention_matcher.js'
import { filter, find } from 'lodash'

const Status = {
  name: 'Status',
  props: [
    'statusoid',
    'expandable',
    'inConversation',
    'focused',
    'highlight',
    'compact',
    'replies',
    'noReplyLinks',
    'noHeading',
    'inlineExpanded'
  ],
  data () {
    return {
      replying: false,
      expanded: false,
      unmuted: false,
      userExpanded: false,
      preview: null,
      showPreview: false,
      showingTall: this.inConversation && this.focused,
      expandingSubject: typeof this.$store.state.config.collapseMessageWithSubject === 'undefined'
        ? !this.$store.state.instance.collapseMessageWithSubject
        : !this.$store.state.config.collapseMessageWithSubject,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter,
      maxAttachments: 9
    }
  },
  computed: {
    localCollapseSubjectDefault () {
      return typeof this.$store.state.config.collapseMessageWithSubject === 'undefined'
        ? this.$store.state.instance.collapseMessageWithSubject
        : this.$store.state.config.collapseMessageWithSubject
    },
    muteWords () {
      return this.$store.state.config.muteWords
    },
    repeaterClass () {
      const user = this.statusoid.user
      return highlightClass(user)
    },
    userClass () {
      const user = this.retweet ? (this.statusoid.retweeted_status.user) : this.statusoid.user
      return highlightClass(user)
    },
    deleted () {
      return this.statusoid.deleted
    },
    repeaterStyle () {
      const user = this.statusoid.user
      const highlight = this.$store.state.config.highlight
      return highlightStyle(highlight[user.screen_name])
    },
    userStyle () {
      if (this.noHeading) return
      const user = this.retweet ? (this.statusoid.retweeted_status.user) : this.statusoid.user
      const highlight = this.$store.state.config.highlight
      return highlightStyle(highlight[user.screen_name])
    },
    hideAttachments () {
      return (this.$store.state.config.hideAttachments && !this.inConversation) ||
        (this.$store.state.config.hideAttachmentsInConv && this.inConversation)
    },
    userProfileLink () {
      return this.generateUserProfileLink(this.status.user.id, this.status.user.screen_name)
    },
    replyProfileLink () {
      if (this.isReply) {
        return this.generateUserProfileLink(this.status.in_reply_to_user_id, this.replyToName)
      }
    },
    retweet () { return !!this.statusoid.retweeted_status },
    retweeter () { return this.statusoid.user.name },
    retweeterHtml () { return this.statusoid.user.name_html },
    status () {
      if (this.retweet) {
        return this.statusoid.retweeted_status
      } else {
        return this.statusoid
      }
    },
    loggedIn () {
      return !!this.$store.state.users.currentUser
    },
    muteWordHits () {
      const statusText = this.status.text.toLowerCase()
      const hits = filter(this.muteWords, (muteWord) => {
        return statusText.includes(muteWord.toLowerCase())
      })

      return hits
    },
    muted () { return !this.unmuted && (this.status.user.muted || this.muteWordHits.length > 0) },
    isFocused () {
      // retweet or root of an expanded conversation
      if (this.focused) {
        return true
      } else if (!this.inConversation) {
        return false
      }
      // use conversation highlight only when in conversation
      return this.status.id === this.highlight
    },
    // This is a bit hacky, but we want to approximate post height before rendering
    // so we count newlines (masto uses <p> for paragraphs, GS uses <br> between them)
    // as well as approximate line count by counting characters and approximating ~80
    // per line.
    //
    // Using max-height + overflow: auto for status components resulted in false positives
    // very often with japanese characters, and it was very annoying.
    tallStatus () {
      const lengthScore = this.status.statusnet_html.split(/<p|<br/).length + this.status.text.length / 80
      return lengthScore > 20
    },
    isReply () {
      return !!(this.status.in_reply_to_status_id && this.status.in_reply_to_user_id)
    },
    replyToName () {
      const user = this.$store.state.users.usersObject[this.status.in_reply_to_user_id]
      if (user) {
        return user.screen_name
      } else {
        return this.status.in_reply_to_screen_name
      }
    },
    hideReply () {
      if (this.$store.state.config.replyVisibility === 'all') {
        return false
      }
      if (this.inlineExpanded || this.expanded || this.inConversation || !this.isReply) {
        return false
      }
      if (this.status.user.id === this.$store.state.users.currentUser.id) {
        return false
      }
      if (this.status.type === 'retweet') {
        return false
      }
      var checkFollowing = this.$store.state.config.replyVisibility === 'following'
      for (var i = 0; i < this.status.attentions.length; ++i) {
        if (this.status.user.id === this.status.attentions[i].id) {
          continue
        }
        if (checkFollowing && this.status.attentions[i].following) {
          return false
        }
        if (this.status.attentions[i].id === this.$store.state.users.currentUser.id) {
          return false
        }
      }
      return this.status.attentions.length > 0
    },
    hideSubjectStatus () {
      if (this.tallStatus && !this.localCollapseSubjectDefault) {
        return false
      }
      return !this.expandingSubject && this.status.summary
    },
    hideTallStatus () {
      if (this.status.summary && this.localCollapseSubjectDefault) {
        return false
      }
      if (this.showingTall) {
        return false
      }
      return this.tallStatus
    },
    showingMore () {
      return (this.tallStatus && this.showingTall) || (this.status.summary && this.expandingSubject)
    },
    nsfwClickthrough () {
      if (!this.status.nsfw) {
        return false
      }
      if (this.status.summary && this.localCollapseSubjectDefault) {
        return false
      }
      return true
    },
    replySubject () {
      if (!this.status.summary) return ''
      const behavior = typeof this.$store.state.config.subjectLineBehavior === 'undefined'
            ? this.$store.state.instance.subjectLineBehavior
            : this.$store.state.config.subjectLineBehavior
      const startsWithRe = this.status.summary.match(/^re[: ]/i)
      if (behavior !== 'noop' && startsWithRe || behavior === 'masto') {
        return this.status.summary
      } else if (behavior === 'email') {
        return 're: '.concat(this.status.summary)
      } else if (behavior === 'noop') {
        return ''
      }
    },
    attachmentSize () {
      if ((this.$store.state.config.hideAttachments && !this.inConversation) ||
        (this.$store.state.config.hideAttachmentsInConv && this.inConversation) ||
        (this.status.attachments.length > this.maxAttachments)) {
        return 'hide'
      } else if (this.compact) {
        return 'small'
      }
      return 'normal'
    },
    galleryTypes () {
      if (this.attachmentSize === 'hide') {
        return []
      }
      return this.$store.state.config.playVideosInline
        ? ['image']
        : ['image', 'video']
    },
    galleryAttachments () {
      return this.status.attachments.filter(
        file => fileType.fileMatchesSomeType(this.galleryTypes, file)
      )
    },
    nonGalleryAttachments () {
      return this.status.attachments.filter(
        file => !fileType.fileMatchesSomeType(this.galleryTypes, file)
      )
    }
  },
  components: {
    Attachment,
    FavoriteButton,
    RetweetButton,
    DeleteButton,
    PostStatusForm,
    UserCardContent,
    StillImage,
    Gallery,
    LinkPreview
  },
  methods: {
    visibilityIcon (visibility) {
      switch (visibility) {
        case 'private':
          return 'icon-lock'
        case 'unlisted':
          return 'icon-lock-open-alt'
        case 'direct':
          return 'icon-mail-alt'
        default:
          return 'icon-globe'
      }
    },
    linkClicked (event) {
      let { target } = event
      if (target.tagName === 'SPAN') {
        target = target.parentNode
      }
      if (target.tagName === 'A') {
        if (target.className.match(/mention/)) {
          const href = target.getAttribute('href')
          const attn = this.status.attentions.find(attn => mentionMatchesUrl(attn, href))
          if (attn) {
            event.stopPropagation()
            event.preventDefault()
            const link = this.generateUserProfileLink(attn.id, attn.screen_name)
            this.$router.push(link)
            return
          }
        }
        window.open(target.href, '_blank')
      }
    },
    toggleReplying () {
      this.replying = !this.replying
    },
    gotoOriginal (id) {
      // only handled by conversation, not status_or_conversation
      if (this.inConversation) {
        this.$emit('goto', id)
      }
    },
    toggleExpanded () {
      this.$emit('toggleExpanded')
    },
    toggleMute () {
      this.unmuted = !this.unmuted
    },
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    toggleShowMore () {
      if (this.showingTall) {
        this.showingTall = false
      } else if (this.expandingSubject && this.status.summary) {
        this.expandingSubject = false
      } else if (this.hideTallStatus) {
        this.showingTall = true
      } else if (this.hideSubjectStatus && this.status.summary) {
        this.expandingSubject = true
      }
    },
    replyEnter (id, event) {
      this.showPreview = true
      const targetId = id
      const statuses = this.$store.state.statuses.allStatuses

      if (!this.preview) {
        // if we have the status somewhere already
        this.preview = find(statuses, { 'id': targetId })
        // or if we have to fetch it
        if (!this.preview) {
          this.$store.state.api.backendInteractor.fetchStatus({id}).then((status) => {
            this.preview = status
          })
        }
      } else if (this.preview.id !== targetId) {
        this.preview = find(statuses, { 'id': targetId })
      }
    },
    replyLeave () {
      this.showPreview = false
    },
    generateUserProfileLink (id, name) {
      return generateProfileLink(id, name, this.$store.state.instance.restrictedNicknames)
    },
    setMedia () {
      const attachments = this.attachmentSize === 'hide' ? this.status.attachments : this.galleryAttachments
      return () => this.$store.dispatch('setMedia', attachments)
    }
  },
  watch: {
    'highlight': function (id) {
      if (this.status.id === id) {
        let rect = this.$el.getBoundingClientRect()
        if (rect.top < 100) {
          // Post is above screen, match its top to screen top
          window.scrollBy(0, rect.top - 100)
        } else if (rect.height >= (window.innerHeight - 50)) {
          // Post we want to see is taller than screen so match its top to screen top
          window.scrollBy(0, rect.top - 100)
        } else if (rect.bottom > window.innerHeight - 50) {
          // Post is below screen, match its bottom to screen bottom
          window.scrollBy(0, rect.bottom - window.innerHeight + 50)
        }
      }
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
}

export default Status
