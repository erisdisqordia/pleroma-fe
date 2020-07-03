import Popover from '../popover/popover.vue'
import { mapState } from 'vuex'

const TimelineMenu = {
  components: {
    Popover
  },
  data () {
    return {
      isOpen: false
    }
  },
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  methods: {
    openMenu () {
      // Tried using $nextTick, but the animation wouldn't
      // play, I assume it played too quickly
      setTimeout(() => {
        this.isOpen = true
      }, 1)
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating
    }),
    timelineNamesForRoute () {
      return {
        'friends': this.$t('nav.timeline'),
        'dms': this.$t('nav.dms'),
        'public-timeline': this.$t('nav.public_tl'),
        'public-external-timeline': this.$t('nav.twkn')
      }
    }
  }
}

export default TimelineMenu
