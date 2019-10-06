import UserAvatar from '../user_avatar/user_avatar.vue'
import RemoteFollow from '../remote_follow/remote_follow.vue'
import ProgressButton from '../progress_button/progress_button.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'
import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { mapGetters } from 'vuex'

export default {
  props: [ 'user', 'switcher', 'selected', 'hideBio', 'rounded', 'bordered', 'allowZoomingAvatar' ],
  data () {
    return {
      followRequestInProgress: false,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter
    }
  },
  created () {
    this.$store.dispatch('fetchUserRelationship', this.user.id)
  },
  computed: {
    classes () {
      return [{
        'user-card-rounded-t': this.rounded === 'top', // set border-top-left-radius and border-top-right-radius
        'user-card-rounded': this.rounded === true, // set border-radius for all sides
        'user-card-bordered': this.bordered === true // set border for all sides
      }]
    },
    style () {
      const color = this.$store.getters.mergedConfig.customTheme.colors
        ? this.$store.getters.mergedConfig.customTheme.colors.bg // v2
        : this.$store.getters.mergedConfig.colors.bg // v1

      if (color) {
        const rgb = (typeof color === 'string') ? hex2rgb(color) : color
        const tintColor = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .5)`

        return {
          backgroundColor: `rgb(${Math.floor(rgb.r * 0.53)}, ${Math.floor(rgb.g * 0.56)}, ${Math.floor(rgb.b * 0.59)})`,
          backgroundImage: [
            `linear-gradient(to bottom, ${tintColor}, ${tintColor})`,
            `url(${this.user.cover_photo})`
          ].join(', ')
        }
      }
    },
    isOtherUser () {
      return this.user.id !== this.$store.state.users.currentUser.id
    },
    subscribeUrl () {
      // eslint-disable-next-line no-undef
      const serverUrl = new URL(this.user.statusnet_profile_url)
      return `${serverUrl.protocol}//${serverUrl.host}/main/ostatus`
    },
    loggedIn () {
      return this.$store.state.users.currentUser
    },
    dailyAvg () {
      const days = Math.ceil((new Date() - new Date(this.user.created_at)) / (60 * 60 * 24 * 1000))
      return Math.round(this.user.statuses_count / days)
    },
    userHighlightType: {
      get () {
        const data = this.$store.getters.mergedConfig.highlight[this.user.screen_name]
        return (data && data.type) || 'disabled'
      },
      set (type) {
        const data = this.$store.getters.mergedConfig.highlight[this.user.screen_name]
        if (type !== 'disabled') {
          this.$store.dispatch('setHighlight', { user: this.user.screen_name, color: (data && data.color) || '#FFFFFF', type })
        } else {
          this.$store.dispatch('setHighlight', { user: this.user.screen_name, color: undefined })
        }
      },
      ...mapGetters(['mergedConfig'])
    },
    userHighlightColor: {
      get () {
        const data = this.$store.getters.mergedConfig.highlight[this.user.screen_name]
        return data && data.color
      },
      set (color) {
        this.$store.dispatch('setHighlight', { user: this.user.screen_name, color })
      }
    },
    visibleRole () {
      const rights = this.user.rights
      if (!rights) { return }
      const validRole = rights.admin || rights.moderator
      const roleTitle = rights.admin ? 'admin' : 'moderator'
      return validRole && roleTitle
    },
    ...mapGetters(['mergedConfig'])
  },
  components: {
    UserAvatar,
    RemoteFollow,
    ModerationTools,
    ProgressButton
  },
  methods: {
    followUser () {
      const store = this.$store
      this.followRequestInProgress = true
      requestFollow(this.user, store).then(() => {
        this.followRequestInProgress = false
      })
    },
    unfollowUser () {
      const store = this.$store
      this.followRequestInProgress = true
      requestUnfollow(this.user, store).then(() => {
        this.followRequestInProgress = false
        store.commit('removeStatus', { timeline: 'friends', userId: this.user.id })
      })
    },
    blockUser () {
      this.$store.dispatch('blockUser', this.user.id)
    },
    unblockUser () {
      this.$store.dispatch('unblockUser', this.user.id)
    },
    muteUser () {
      this.$store.dispatch('muteUser', this.user.id)
    },
    unmuteUser () {
      this.$store.dispatch('unmuteUser', this.user.id)
    },
    subscribeUser () {
      return this.$store.dispatch('subscribeUser', this.user.id)
    },
    unsubscribeUser () {
      return this.$store.dispatch('unsubscribeUser', this.user.id)
    },
    setProfileView (v) {
      if (this.switcher) {
        const store = this.$store
        store.commit('setProfileView', { v })
      }
    },
    linkClicked ({ target }) {
      if (target.tagName === 'SPAN') {
        target = target.parentNode
      }
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    reportUser () {
      this.$store.dispatch('openUserReportingModal', this.user.id)
    },
    zoomAvatar () {
      const attachment = {
        url: this.user.profile_image_url_original,
        mimetype: 'image'
      }
      this.$store.dispatch('setMedia', [attachment])
      this.$store.dispatch('setCurrent', attachment)
    },
    mentionUser () {
      this.$store.dispatch('openPostStatusModal', { replyTo: true, repliedUser: this.user })
    }
  }
}
