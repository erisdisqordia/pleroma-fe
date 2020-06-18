import FavoriteButton from '../favorite_button/favorite_button.vue'
import ReactButton from '../react_button/react_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import ExtraButtons from '../extra_buttons/extra_buttons.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCard from '../user_card/user_card.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import AvatarList from '../avatar_list/avatar_list.vue'
import Timeago from '../timeago/timeago.vue'
import StatusContent from '../status_content/status_content.vue'
import StatusPopover from '../status_popover/status_popover.vue'
import EmojiReactions from '../emoji_reactions/emoji_reactions.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'
import { muteWordHits } from '../../services/status_parser/status_parser.js'
import { unescape, uniqBy } from 'lodash'
import { mapGetters, mapState } from 'vuex'

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
    'isPreview',
    'noHeading',
    'inlineExpanded',
    'showPinned',
    'inProfile',
    'profileUserId'
  ],
  data () {
    return {
      replying: false,
      unmuted: false,
      userExpanded: false,
      error: null
    }
  },
  computed: {
    muteWords () {
      return this.mergedConfig.muteWords
    },
    showReasonMutedThread () {
      return (
        this.status.thread_muted ||
          (this.status.reblog && this.status.reblog.thread_muted)
      ) && !this.inConversation
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
      const highlight = this.mergedConfig.highlight
      return highlightStyle(highlight[user.screen_name])
    },
    userStyle () {
      if (this.noHeading) return
      const user = this.retweet ? (this.statusoid.retweeted_status.user) : this.statusoid.user
      const highlight = this.mergedConfig.highlight
      return highlightStyle(highlight[user.screen_name])
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
    retweeter () { return this.statusoid.user.name || this.statusoid.user.screen_name },
    retweeterHtml () { return this.statusoid.user.name_html },
    retweeterProfileLink () { return this.generateUserProfileLink(this.statusoid.user.id, this.statusoid.user.screen_name) },
    status () {
      if (this.retweet) {
        return this.statusoid.retweeted_status
      } else {
        return this.statusoid
      }
    },
    statusFromGlobalRepository () {
      // NOTE: Consider to replace status with statusFromGlobalRepository
      return this.$store.state.statuses.allStatusesObject[this.status.id]
    },
    loggedIn () {
      return !!this.currentUser
    },
    muteWordHits () {
      return muteWordHits(this.status, this.muteWords)
    },
    muted () {
      const { status } = this
      const { reblog } = status
      const relationship = this.$store.getters.relationship(status.user.id)
      const relationshipReblog = reblog && this.$store.getters.relationship(reblog.user.id)
      const reasonsToMute = (
        // Post is muted according to BE
        status.muted ||
        // Reprööt of a muted post according to BE
        (reblog && reblog.muted) ||
        // Muted user
        relationship.muting ||
        // Muted user of a reprööt
        (relationshipReblog && relationshipReblog.muting) ||
        // Thread is muted
        status.thread_muted ||
        // Wordfiltered
        this.muteWordHits.length > 0
      )
      const excusesNotToMute = (
        (
          this.inProfile && (
            // Don't mute user's posts on user timeline (except reblogs)
            (!reblog && status.user.id === this.profileUserId) ||
            // Same as above but also allow self-reblogs
            (reblog && reblog.user.id === this.profileUserId)
          )
        ) ||
        // Don't mute statuses in muted conversation when said conversation is opened
        (this.inConversation && status.thread_muted)
        // No excuses if post has muted words
      ) && !this.muteWordHits.length > 0

      return !this.unmuted && !excusesNotToMute && reasonsToMute
    },
    hideFilteredStatuses () {
      return this.mergedConfig.hideFilteredStatuses
    },
    hideStatus () {
      return (this.hideReply || this.deleted) || (this.muted && this.hideFilteredStatuses)
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
    },
    isReply () {
      return !!(this.status.in_reply_to_status_id && this.status.in_reply_to_user_id)
    },
    replyToName () {
      if (this.status.in_reply_to_screen_name) {
        return this.status.in_reply_to_screen_name
      } else {
        const user = this.$store.getters.findUser(this.status.in_reply_to_user_id)
        return user && user.screen_name
      }
    },
    hideReply () {
      if (this.mergedConfig.replyVisibility === 'all') {
        return false
      }
      if (this.inConversation || !this.isReply) {
        return false
      }
      if (this.status.user.id === this.currentUser.id) {
        return false
      }
      if (this.status.type === 'retweet') {
        return false
      }
      const checkFollowing = this.mergedConfig.replyVisibility === 'following'
      for (var i = 0; i < this.status.attentions.length; ++i) {
        if (this.status.user.id === this.status.attentions[i].id) {
          continue
        }
        // There's zero guarantee of this working. If we happen to have that user and their
        // relationship in store then it will work, but there's kinda little chance of having
        // them for people you're not following.
        const relationship = this.$store.state.users.relationships[this.status.attentions[i].id]
        if (checkFollowing && relationship && relationship.following) {
          return false
        }
        if (this.status.attentions[i].id === this.currentUser.id) {
          return false
        }
      }
      return this.status.attentions.length > 0
    },
    replySubject () {
      if (!this.status.summary) return ''
      const decodedSummary = unescape(this.status.summary)
      const behavior = this.mergedConfig.subjectLineBehavior
      const startsWithRe = decodedSummary.match(/^re[: ]/i)
      if ((behavior !== 'noop' && startsWithRe) || behavior === 'masto') {
        return decodedSummary
      } else if (behavior === 'email') {
        return 're: '.concat(decodedSummary)
      } else if (behavior === 'noop') {
        return ''
      }
    },
    combinedFavsAndRepeatsUsers () {
      // Use the status from the global status repository since favs and repeats are saved in it
      const combinedUsers = [].concat(
        this.statusFromGlobalRepository.favoritedBy,
        this.statusFromGlobalRepository.rebloggedBy
      )
      return uniqBy(combinedUsers, 'id')
    },
    tags () {
      return this.status.tags.filter(tagObj => tagObj.hasOwnProperty('name')).map(tagObj => tagObj.name).join(' ')
    },
    hidePostStats () {
      return this.mergedConfig.hidePostStats
    },
    ...mapGetters(['mergedConfig']),
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter,
      currentUser: state => state.users.currentUser
    })
  },
  components: {
    FavoriteButton,
    ReactButton,
    RetweetButton,
    ExtraButtons,
    PostStatusForm,
    UserCard,
    UserAvatar,
    AvatarList,
    Timeago,
    StatusPopover,
    EmojiReactions,
    StatusContent
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
    showError (error) {
      this.error = error
    },
    clearError () {
      this.error = undefined
    },
    toggleReplying () {
      this.replying = !this.replying
    },
    gotoOriginal (id) {
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
    generateUserProfileLink (id, name) {
      return generateProfileLink(id, name, this.$store.state.instance.restrictedNicknames)
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
    },
    'status.repeat_num': function (num) {
      // refetch repeats when repeat_num is changed in any way
      if (this.isFocused && this.statusFromGlobalRepository.rebloggedBy && this.statusFromGlobalRepository.rebloggedBy.length !== num) {
        this.$store.dispatch('fetchRepeats', this.status.id)
      }
    },
    'status.fave_num': function (num) {
      // refetch favs when fave_num is changed in any way
      if (this.isFocused && this.statusFromGlobalRepository.favoritedBy && this.statusFromGlobalRepository.favoritedBy.length !== num) {
        this.$store.dispatch('fetchFavs', this.status.id)
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
