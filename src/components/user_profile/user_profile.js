import UserCardContent from '../user_card_content/user_card_content.vue'
import UserCard from '../user_card/user_card.vue'
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
    friends () {
      return this.user.friends
    },
    followers () {
      return this.user.followers
    },
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
  methods: {
    fetchFollowers () {
      const id = this.userId
      this.$store.dispatch('addFollowers', { id })
    },
    fetchFriends () {
      const id = this.userId
      this.$store.dispatch('addFriends', { id })
    }
  },
  watch: {
    userId () {
      this.$store.dispatch('stopFetching', 'user')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.dispatch('startFetching', ['user', this.userId])
    },
    user () {
      if (!this.user.followers) {
        this.fetchFollowers()
        this.fetchFriends()
      }
    }
  },
  components: {
    UserCardContent,
    UserCard,
    Timeline
  }
}

export default UserProfile
