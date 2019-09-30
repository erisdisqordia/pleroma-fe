import UserAvatar from '../user_avatar/user_avatar.vue'
import RemoteFollow from '../remote_follow/remote_follow.vue'
import ProgressButton from '../progress_button/progress_button.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'
import AccountActions from '../account_actions/account_actions.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

export default {
  props: [
    'user', 'switcher', 'selected', 'hideBio', 'rounded', 'bordered', 'allowZoomingAvatar'
  ],
  data () {
    return {
      followRequestInProgress: false,
      hideUserStatsLocal: typeof this.$store.state.config.hideUserStats === 'undefined'
        ? this.$store.state.instance.hideUserStats
        : this.$store.state.config.hideUserStats,
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
      const color = this.$store.state.config.customTheme.colors
        ? this.$store.state.config.customTheme.colors.bg // v2
        : this.$store.state.config.colors.bg // v1

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
        const data = this.$store.state.config.highlight[this.user.screen_name]
        return (data && data.type) || 'disabled'
      },
      set (type) {
        const data = this.$store.state.config.highlight[this.user.screen_name]
        if (type !== 'disabled') {
          this.$store.dispatch('setHighlight', { user: this.user.screen_name, color: (data && data.color) || '#FFFFFF', type })
        } else {
          this.$store.dispatch('setHighlight', { user: this.user.screen_name, color: undefined })
        }
      }
    },
    userHighlightColor: {
      get () {
        const data = this.$store.state.config.highlight[this.user.screen_name]
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
    }
  },
  components: {
    UserAvatar,
    RemoteFollow,
    ModerationTools,
    AccountActions,
    ProgressButton
  },
  methods: {
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
      return generateProfileLink(
        user.id, user.screen_name,
        this.$store.state.instance.restrictedNicknames
      )
    },
    zoomAvatar () {
      const attachment = {
        url: this.user.profile_image_url_original,
        mimetype: 'image'
      }
      this.$store.dispatch('setMedia', [attachment])
      this.$store.dispatch('setCurrent', attachment)
    }
  }
}
