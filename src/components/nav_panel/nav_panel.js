import { timelineNames } from '../timeline_menu/timeline_menu.js'
import { mapState, mapGetters } from 'vuex'

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
      if (this.$store.state.interface.lastTimeline) {
        return this.$store.state.interface.lastTimeline
      }
      return this.currentUser ? 'friends' : 'public-timeline'
    },
    ...mapState({
      currentUser: state => state.users.currentUser,
      followRequestCount: state => state.api.followRequests.length,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating,
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    }),
    ...mapGetters(['unreadChatCount'])
  }
}

export default NavPanel
