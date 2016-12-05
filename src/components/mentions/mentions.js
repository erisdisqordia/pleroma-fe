import Timeline from '../timeline/timeline.vue'

const Mentions = {
  computed: {
    username () {
      return this.$route.params.username
    },
    timeline () {
      return this.$store.state.statuses.timelines.mentions
    }
  },
  components: {
    Timeline
  },
  created () {
    this.$store.state.api.backendInteractor.fetchMentions({username: this.username})
      .then((mentions) => {
        this.$store.dispatch('addNewStatuses', {
          statuses: mentions,
          timeline: 'mentions',
          showImmediately: true
        })
      })
  }
}

export default Mentions
