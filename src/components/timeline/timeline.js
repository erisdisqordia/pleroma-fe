import Status from '../status/status.vue'
import timelineFetcher from '../../services/timeline_fetcher/timeline_fetcher.service.js'

const Timeline = {
  props: [
    'timeline',
    'timelineName'
  ],
  components: {
    Status
  },
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials

    timelineFetcher.fetchAndUpdate({
      store,
      credentials,
      timeline: this.timelineName,
      showImmediately: true
    })
  },
  methods: {
    showNewStatuses () {
      this.$store.commit('showNewStatuses', { timeline: this.timelineName })
    },
    fetchOlderStatuses () {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials
      store.commit('setLoading', { timeline: this.timelineName, value: true })
      timelineFetcher.fetchAndUpdate({
        store,
        credentials,
        timeline: this.timelineName,
        older: true,
        showImmediately: true
      }).then(() => store.commit('setLoading', { timeline: this.timelineName, value: false }))
    }
  }
}

export default Timeline
