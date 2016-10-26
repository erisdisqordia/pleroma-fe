import Timeline from '../timeline/timeline.vue'
const PublicTimeline = {
  components: {
    Timeline
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.public }
  }
}

export default PublicTimeline
