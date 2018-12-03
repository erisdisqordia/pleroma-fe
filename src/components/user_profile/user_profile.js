import UserCardContent from '../user_card_content/user_card_content.vue'
import Timeline from '../timeline/timeline.vue'

const UserProfile = {
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.dispatch('startFetching', ['user', this.userId])
    if (!this.$store.state.users.usersObject[this.userId]) {
      this.$store.dispatch('fetchUser', this.userId)
    }
  },
  destroyed () {
    this.$store.dispatch('stopFetching', 'user')
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.user },
    userId () {
      return this.$route.params.id
    },
    user () {
      if (this.timeline.statuses[0]) {
        return this.timeline.statuses[0].user
      } else {
        return this.$store.state.users.usersObject[this.userId] || false
      }
    }
  },
  watch: {
    userId () {
      this.$store.dispatch('stopFetching', 'user')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.dispatch('startFetching', ['user', this.userId])
    }
  },
  components: {
    UserCardContent,
    Timeline
  }
}

export default UserProfile
