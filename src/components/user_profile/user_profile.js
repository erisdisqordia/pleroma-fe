import UserCardContent from '../user_card_content/user_card_content.vue'
import Timeline from '../timeline/timeline.vue'

const UserProfile = {
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.dispatch('startFetching', ['user', this.userId])
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
      return this.$store.state.users.usersObject[this.userId]
    }
  },
  components: {
    UserCardContent,
    Timeline
  }
}

export default UserProfile
