import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import DeleteButton from '../delete_button/delete_button.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'
import StillImage from '../still-image/still-image.vue'
import { filter, find } from 'lodash'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'

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
      showingTall: false,
      expandingCW: this.$store.state.config.expandCW
    }
  },
  computed: {
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
    isReply () { return !!this.status.in_reply_to_status_id },
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
    hideCWStatus () {
        if (this.tallStatus && this.$store.state.config.expandCW) {
          return false
        }
        return !this.expandingCW && this.status.summary
    },
    hideTallStatus () {
      if (this.status.summary && !this.$store.state.config.expandCW) {
        return false
      }
      if (this.showingTall) {
        return false
      }
      return this.tallStatus
    },
    showingMore () {
      return this.showingTall || (this.status.summary && this.expandingCW)
    },
    attachmentSize () {
      if ((this.$store.state.config.hideAttachments && !this.inConversation) ||
        (this.$store.state.config.hideAttachmentsInConv && this.inConversation)) {
        return 'hide'
      } else if (this.compact) {
        return 'small'
      }
      return 'normal'
    }
  },
  components: {
    Attachment,
    FavoriteButton,
    RetweetButton,
    DeleteButton,
    PostStatusForm,
    UserCardContent,
    StillImage
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
    linkClicked ({target}) {
      if (target.tagName === 'SPAN') {
        target = target.parentNode
      }
      if (target.tagName === 'A') {
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
      } else if (this.expandingCW) {
        this.expandingCW = false
      } else if (this.hideTallStatus) {
        this.showingTall = true
      } else if (this.hideCWStatus) {
        this.expandingCW = true
      }
    },
    replyEnter (id, event) {
      this.showPreview = true
      const targetId = Number(id)
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
    }
  },
  watch: {
    'highlight': function (id) {
      id = Number(id)
      if (this.status.id === id) {
        let rect = this.$el.getBoundingClientRect()
        if (rect.top < 100) {
          window.scrollBy(0, rect.top - 200)
        } else if (rect.bottom > window.innerHeight - 50) {
          window.scrollBy(0, rect.bottom - window.innerHeight + 50)
        }
      }
    }
  }
}

export default Status
