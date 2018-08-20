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
  data () {
    return {
      paused: false,
      unfocused: false
    }
  },
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
    },
    newStatusCount () {
      return this.timeline.newStatusCount
    },
    newStatusCountStr () {
      if (this.timeline.flushMarker !== 0) {
        return ''
      } else {
        return ` (${this.newStatusCount})`
      }
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

    window.addEventListener('scroll', this.scrollLoad)

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
  mounted () {
    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
      this.unfocused = document.hidden
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollLoad)
    if (typeof document.hidden !== 'undefined') document.removeEventListener('visibilitychange', this.handleVisibilityChange, false)
    this.$store.commit('setLoading', { timeline: this.timelineName, value: false })
  },
  methods: {
    showNewStatuses () {
      if (this.timeline.flushMarker !== 0) {
        this.$store.commit('clearTimeline', { timeline: this.timelineName })
        this.$store.commit('queueFlush', { timeline: this.timelineName, id: 0 })
        this.fetchOlderStatuses()
      } else {
        this.$store.commit('showNewStatuses', { timeline: this.timelineName })
        this.paused = false
      }
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
      const bodyBRect = document.body.getBoundingClientRect()
      const height = Math.max(bodyBRect.height, -(bodyBRect.y))
      if (this.timeline.loading === false &&
          this.$store.state.config.autoLoad &&
          this.$el.offsetHeight > 0 &&
          (window.innerHeight + window.pageYOffset) >= (height - 750)) {
        this.fetchOlderStatuses()
      }
    },
    handleVisibilityChange () {
      this.unfocused = document.hidden
    }
  },
  watch: {
    newStatusCount (count) {
      if (!this.$store.state.config.streaming) {
        return
      }
      if (count > 0) {
        // only 'stream' them when you're scrolled to the top
        if (window.pageYOffset < 15 &&
            !this.paused &&
            !(this.unfocused && this.$store.state.config.pauseOnUnfocused)
           ) {
          this.showNewStatuses()
        } else {
          this.paused = true
        }
      }
    }
  }
}

export default Timeline
