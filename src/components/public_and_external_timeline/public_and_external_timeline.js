import Timeline from '../timeline/timeline.vue'
const PublicAndExternalTimeline = {
  components: {
    Timeline
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.publicAndExternal }
  },
  created () {
    this.$store.dispatch('startFetchingTimeline', { timeline: 'publicAndExternal' })
  },
  destroyed () {
    this.$store.dispatch('stopFetchingTimeline', 'publicAndExternal')
  }
}

export default PublicAndExternalTimeline
