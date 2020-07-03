import { mapState } from 'vuex'

const timelineRoutes = [
  'friends',
  'dms',
  'public-timeline',
  'public-external-timeline'
]

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  computed: {
    onTimelineRoute () {
      return timelineRoutes.includes(this.$route.name)
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
