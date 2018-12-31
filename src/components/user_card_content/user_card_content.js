import StillImage from '../still-image/still-image.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'
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
    }
  },
  components: {
    StillImage
  },
  methods: {
    followUser () {
      const store = this.$store
      this.followRequestInProgress = true
      store.state.api.backendInteractor.followUser(this.user.id)
        .then((followedUser) => store.commit('addNewUsers', [followedUser]))
        .then(() => {
          // For locked users we just mark it that we sent the follow request
          if (this.user.locked) {
            this.followRequestInProgress = false
            this.followRequestSent = true
            return
          }

          if (this.user.following) {
            // If we get result immediately, just stop.
            this.followRequestInProgress = false
            return
          }

          // But usually we don't get result immediately, so we ask server
          // for updated user profile to confirm if we are following them
          // Sometimes it takes several tries. Sometimes we end up not following
          // user anyway, probably because they locked themselves and we
          // don't know that yet.
          // Recursive Promise, it will call itself up to 3 times.
          const fetchUser = (attempt) => new Promise((resolve, reject) => {
            setTimeout(() => {
              store.state.api.backendInteractor.fetchUser({ id: this.user.id })
                .then((user) => store.commit('addNewUsers', [user]))
                .then(() => resolve([this.user.following, attempt]))
                .catch((e) => reject(e))
            }, 500)
          }).then(([following, attempt]) => {
            if (!following && attempt <= 3) {
              // If we BE reports that we still not following that user - retry,
              // increment attempts by one
              return fetchUser(++attempt)
            } else {
              // If we run out of attempts, just return whatever status is.
              return following
            }
          })

          return fetchUser(1)
            .then((following) => {
              if (following) {
                // We confirmed and everything its good.
                this.followRequestInProgress = false
              } else {
                // If after all the tries, just treat it as if user is locked
                this.followRequestInProgress = false
                this.followRequestSent = true
              }
            })
        })
    },
    unfollowUser () {
      const store = this.$store
      this.followRequestInProgress = true
      store.state.api.backendInteractor.unfollowUser(this.user.id)
        .then((unfollowedUser) => store.commit('addNewUsers', [unfollowedUser]))
        .then(() => {
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
