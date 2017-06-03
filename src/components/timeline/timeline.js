import Status from '../status/status.vue'
import timelineFetcher from '../../services/timeline_fetcher/timeline_fetcher.service.js'
import StatusOrConversation from '../status_or_conversation/status_or_conversation.vue'

const Timeline = {
  props: [
    'timeline',
    'timelineName',
    'title'
  ],
  computed: {
    timelineError () { return this.$store.state.statuses.error }
  },
  components: {
    Status,
    StatusOrConversation
  },
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials
    const showImmediately = this.timeline.visibleStatuses.length === 0

    window.onscroll = this.scrollLoad

    timelineFetcher.fetchAndUpdate({
      store,
      credentials,
      timeline: this.timelineName,
      showImmediately
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
    },
    scrollLoad (e) {
      if (this.timeline.loading === false && this.$store.state.config.autoLoad && (window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 750)) {
        this.fetchOlderStatuses()
      }
    }
  }
}

export default Timeline
