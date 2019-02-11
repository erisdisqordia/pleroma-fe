import UserAvatar from '../user_avatar/user_avatar.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'
import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

export default {
  props: [ 'user', 'switcher', 'selected', 'hideBio' ],
  data () {
    return {
      followRequestInProgress: false,
      followRequestSent: false,
      hideUserStatsLocal: typeof this.$store.state.config.hideUserStats === 'undefined'
        ? this.$store.state.instance.hideUserStats
        : this.$store.state.config.hideUserStats,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter
    }
  },
  computed: {
    headingStyle () {
      const color = this.$store.state.config.customTheme.colors
            ? this.$store.state.config.customTheme.colors.bg  // v2
            : this.$store.state.config.colors.bg // v1

      if (color) {
        const rgb = (typeof color === 'string') ? hex2rgb(color) : color
        const tintColor = `rgba(${Math.floor(rgb.r)}, ${Math.floor(rgb.g)}, ${Math.floor(rgb.b)}, .5)`

        const gradient = [
          [tintColor, this.hideBio ? '60%' : ''],
          this.hideBio ? [
            color, '100%'
          ] : [
            tintColor, ''
          ]
        ].map(_ => _.join(' ')).join(', ')

        return {
          backgroundColor: `rgb(${Math.floor(rgb.r * 0.53)}, ${Math.floor(rgb.g * 0.56)}, ${Math.floor(rgb.b * 0.59)})`,
          backgroundImage: [
            `linear-gradient(to bottom, ${gradient})`,
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
        return data && data.type || 'disabled'
      },
      set (type) {
        const data = this.$store.state.config.highlight[this.user.screen_name]
        if (type !== 'disabled') {
          this.$store.dispatch('setHighlight', { user: this.user.screen_name, color: data && data.color || '#FFFFFF', type })
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
      const validRole = (this.user.role === 'admin' || this.user.role === 'moderator')
      const showRole = this.isOtherUser || this.user.show_role

      return validRole && showRole && this.user.role
    }
  },
  components: {
    UserAvatar
  },
  methods: {
    followUser () {
      this.followRequestInProgress = true
      requestFollow(this.user, this.$store).then(({sent}) => {
        this.followRequestInProgress = false
        this.followRequestSent = sent
      })
    },
    unfollowUser () {
      this.followRequestInProgress = true
      requestUnfollow(this.user, this.$store).then(() => {
        this.followRequestInProgress = false
      })
    },
    blockUser () {
      const store = this.$store
      store.state.api.backendInteractor.blockUser(this.user.id)
        .then((blockedUser) => store.commit('addNewUsers', [blockedUser]))
    },
    unblockUser () {
      const store = this.$store
      store.state.api.backendInteractor.unblockUser(this.user.id)
        .then((unblockedUser) => store.commit('addNewUsers', [unblockedUser]))
    },
    toggleMute () {
      const store = this.$store
      store.commit('setMuted', {user: this.user, muted: !this.user.muted})
      store.state.api.backendInteractor.setUserMute(this.user)
    },
    setProfileView (v) {
      if (this.switcher) {
        const store = this.$store
        store.commit('setProfileView', { v })
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
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    }
  }
}
