import UserCardContent from '../user_card_content/user_card_content.vue'
import UserCard from '../user_card/user_card.vue'
import Timeline from '../timeline/timeline.vue'

const UserProfile = {
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.dispatch('startFetching', ['user', this.fetchBy])
    if (!this.user) {
      this.$store.dispatch('fetchUser', this.fetchBy)
    }
  },
  destroyed () {
    this.$store.dispatch('stopFetching', 'user')
  },
  computed: {
    timeline () {
      return this.$store.state.statuses.timelines.user
    },
    userId () {
      return this.$route.params.id || this.user.id
    },
    userName () {
      return this.$route.params.name
    },
    friends () {
      return this.user.friends
    },
    followers () {
      return this.user.followers
    },
    user () {
      if (this.timeline.statuses[0]) {
        return this.timeline.statuses[0].user
      } else {
        return Object.values(this.$store.state.users.usersObject).filter(user => {
          return (this.isExternal ? user.id === this.userId : user.screen_name === this.userName)
        })[0] || {}
      }
    },
    fetchBy () {
      return this.isExternal ? this.userId : this.userName
    },
    isExternal () {
      return this.$route.name === 'external-user-profile'
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
    userName () {
      if (this.isExternal) {
        return
      }
      this.$store.dispatch('stopFetching', 'user')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.dispatch('startFetching', ['user', this.userName])
    },
    userId () {
      if (!this.isExternal) {
        return
      }
      this.$store.dispatch('stopFetching', 'user')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.dispatch('startFetching', ['user', this.userId])
    },
    user () {
      if (this.user.id && !this.user.followers) {
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
