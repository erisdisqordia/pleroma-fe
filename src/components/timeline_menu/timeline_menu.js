import Popover from '../popover/popover.vue'
import { mapState } from 'vuex'

const TimelineMenu = {
  components: {
    Popover
  },
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
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
