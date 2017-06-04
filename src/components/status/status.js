import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import DeleteButton from '../delete_button/delete_button.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'
import { filter } from 'lodash'

const Status = {
  props: [
    'statusoid',
    'expandable',
    'inConversation',
    'focused',
    'highlight',
    'compact',
    'replies'
  ],
  data: () => ({
    replying: false,
    expanded: false,
    unmuted: false,
    userExpanded: false
  }),
  computed: {
    muteWords () {
      return this.$store.state.config.muteWords
    },
    hideAttachments () {
      return (this.$store.state.config.hideAttachments && !this.inConversation) ||
        (this.$store.state.config.hideAttachmentsInConv && this.inConversation)
    },
    retweet () { return !!this.statusoid.retweeted_status },
    retweeter () { return this.statusoid.user.name },
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
    borderColor () {
      return {
        borderBottomColor: this.$store.state.config.colors['base02']
      }
    },
    isFocused () {
      // retweet or root of an expanded conversation
      if (this.focused) {
        return true
      } else if (!this.inConversation) {
        return false
      }
      // use conversation highlight only when in conversation
      return this.status.id === this.highlight
    }
  },
  components: {
    Attachment,
    FavoriteButton,
    RetweetButton,
    DeleteButton,
    PostStatusForm,
    UserCardContent
  },
  methods: {
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
      this.$emit('goto', id)
    },
    toggleExpanded () {
      this.$emit('toggleExpanded')
    },
    toggleMute () {
      this.unmuted = !this.unmuted
    },
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
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
