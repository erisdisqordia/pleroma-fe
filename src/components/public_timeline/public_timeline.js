import Timeline from '../timeline/timeline.vue'
const PublicTimeline = {
  components: {
    Timeline
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.public },
    currentUser () { return this.$store.state.users.currentUser }
  },
  created () {
    this.$store.dispatch('startFetching', 'public')
  },
  destroyed () {
    this.$store.dispatch('stopFetching', 'public')
  }

}

export default PublicTimeline
