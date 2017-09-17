import Status from '../status/status.vue'
import timelineFetcher from '../../services/timeline_fetcher/timeline_fetcher.service.js'
import StatusOrConversation from '../status_or_conversation/status_or_conversation.vue'
import UserCard from '../user_card/user_card.vue'

const Timeline = {
  props: [
    'timeline',
    'timelineName',
    'title',
    'userId',
    'tag'
  ],
  computed: {
    timelineError () { return this.$store.state.statuses.error },
    followers () {
      return this.timeline.followers
    },
    friends () {
      return this.timeline.friends
    },
    viewing () {
      return this.timeline.viewing
    }
  },
  components: {
    Status,
    StatusOrConversation,
    UserCard
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
      showImmediately,
      userId: this.userId,
      tag: this.tag
    })

    // don't fetch followers for public, friend, twkn
    if (this.timelineName === 'user') {
      this.fetchFriends()
      this.fetchFollowers()
    }
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
        showImmediately: true,
        userId: this.userId,
        tag: this.tag
      }).then(() => store.commit('setLoading', { timeline: this.timelineName, value: false }))
    },
    fetchFollowers () {
      const id = this.userId
      this.$store.state.api.backendInteractor.fetchFollowers({ id })
        .then((followers) => this.$store.dispatch('addFollowers', { followers }))
    },
    fetchFriends () {
      const id = this.userId
      this.$store.state.api.backendInteractor.fetchFriends({ id })
        .then((friends) => this.$store.dispatch('addFriends', { friends }))
    },
    scrollLoad (e) {
      let height = Math.max(document.body.offsetHeight, document.body.scrollHeight)
      if (this.timeline.loading === false && this.$store.state.config.autoLoad && (window.innerHeight + window.pageYOffset) >= (height - 750)) {
        this.fetchOlderStatuses()
      }
    }
  }
}

export default Timeline
