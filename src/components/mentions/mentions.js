import Timeline from '../timeline/timeline.vue'

const Mentions = {
  computed: {
    timeline () {
      return this.$store.state.statuses.timelines.mentions
    }
  },
  components: {
    Timeline
  }
}

export default Mentions
