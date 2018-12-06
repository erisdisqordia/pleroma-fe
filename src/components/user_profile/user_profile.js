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
      return this.user.id
    },
    userName () {
      return this.$route.params.name
    },
    user () {
      if (this.timeline.statuses[0]) {
        return this.timeline.statuses[0].user
      } else {
        return Object.values(this.$store.state.users.usersObject).filter(user => {
          return user.name === this.userName
        })[0] || false
      }
    }
  },
  watch: {
    userName () {
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
