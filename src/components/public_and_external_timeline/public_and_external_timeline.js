import Timeline from '../timeline/timeline.vue'
const PublicAndExternalTimeline = {
  components: {
    Timeline
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.publicAndExternal }
  }
}

export default PublicAndExternalTimeline
