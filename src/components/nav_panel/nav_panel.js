import { mapState } from 'vuex'
import { timelineNames } from '../timeline_menu/timeline_menu.js'

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  computed: {
    onTimelineRoute () {
      return !!timelineNames()[this.$route.name]
    },
    timelinesRoute () {
      return this.currentUser ? 'friends' : 'public-timeline'
    },
    ...mapState({
      currentUser: state => state.users.currentUser,
      followRequestCount: state => state.api.followRequests.length,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating
    })
  }
}

export default NavPanel
