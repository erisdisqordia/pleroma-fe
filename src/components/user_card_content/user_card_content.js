import StillImage from '../still-image/still-image.vue'
import { hex2rgb } from '../../services/color_convert/color_convert.js'

export default {
  props: [ 'user', 'switcher', 'selected', 'hideBio' ],
  computed: {
    headingStyle () {
      const color = this.$store.state.config.colors.bg
      if (color) {
        const rgb = hex2rgb(color)
        console.log(rgb)
        return {
          backgroundColor: `rgb(${Math.floor(rgb[0] * 0.53)}, ${Math.floor(rgb[1] * 0.56)}, ${Math.floor(rgb[2] * 0.59)})`,
          backgroundImage: `url(${this.user.cover_photo})`
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
    }
  },
  components: {
    StillImage
  },
  methods: {
    followUser () {
      const store = this.$store
      store.state.api.backendInteractor.followUser(this.user.id)
        .then((followedUser) => store.commit('addNewUsers', [followedUser]))
    },
    unfollowUser () {
      const store = this.$store
      store.state.api.backendInteractor.unfollowUser(this.user.id)
        .then((unfollowedUser) => store.commit('addNewUsers', [unfollowedUser]))
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
      const store = this.$store
      store.commit('setProfileView', { v })
    }
  }
}
