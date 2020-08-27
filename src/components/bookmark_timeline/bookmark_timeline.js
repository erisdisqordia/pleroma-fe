import Timeline from '../timeline/timeline.vue'

const Bookmarks = {
  computed: {
    timeline () {
      return this.$store.state.statuses.timelines.bookmarks
    }
  },
  components: {
    Timeline
  },
  destroyed () {
    this.$store.commit('clearTimeline', { timeline: 'bookmarks' })
  }
}

export default Bookmarks
