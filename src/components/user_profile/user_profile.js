import UserCardContent from '../user_card_content/user_card_content.vue'
import UserCard from '../user_card/user_card.vue'
import Timeline from '../timeline/timeline.vue'

const UserProfile = {
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.commit('clearTimeline', { timeline: 'favorites' })
    this.$store.commit('clearTimeline', { timeline: 'media' })
    this.$store.dispatch('startFetching', ['user', this.fetchBy])
    this.$store.dispatch('startFetching', ['media', this.fetchBy])
    this.startFetchFavorites()
    if (!this.user.id) {
      this.$store.dispatch('fetchUser', this.fetchBy)
    }
  },
  destroyed () {
    this.$store.dispatch('stopFetching', 'user')
    this.$store.dispatch('stopFetching', 'favorites')
    this.$store.dispatch('stopFetching', 'media')
  },
  computed: {
    timeline () {
      return this.$store.state.statuses.timelines.user
    },
    favorites () {
      return this.$store.state.statuses.timelines.favorites
    },
    media () {
      return this.$store.state.statuses.timelines.media
    },
    userId () {
      return this.$route.params.id || this.user.id
    },
    userName () {
      return this.$route.params.name || this.user.screen_name
    },
    isUs () {
      return this.userId && this.$store.state.users.currentUser.id &&
        this.userId === this.$store.state.users.currentUser.id
    },
    friends () {
      return this.user.friends
    },
    followers () {
      return this.user.followers
    },
    userInStore () {
      if (this.isExternal) {
        return this.$store.getters.userById(this.userId)
      }
      return this.$store.getters.userByName(this.userName)
    },
    user () {
      if (this.timeline.statuses[0]) {
        return this.timeline.statuses[0].user
      }
      if (this.userInStore) {
        return this.userInStore
      }
      return {}
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
    },
    startFetchFavorites () {
      if (this.isUs) {
        this.$store.dispatch('startFetching', ['favorites', this.fetchBy])
      }
    }
  },
  watch: {
    // TODO get rid of this copypasta
    userName () {
      if (this.isExternal) {
        return
      }
      this.$store.dispatch('stopFetching', 'user')
      this.$store.dispatch('stopFetching', 'favorites')
      this.$store.dispatch('stopFetching', 'media')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.commit('clearTimeline', { timeline: 'favorites' })
      this.$store.commit('clearTimeline', { timeline: 'media' })
      this.$store.dispatch('startFetching', ['user', this.fetchBy])
      this.$store.dispatch('startFetching', ['media', this.fetchBy])
      this.startFetchFavorites()
    },
    userId () {
      if (!this.isExternal) {
        return
      }
      this.$store.dispatch('stopFetching', 'user')
      this.$store.dispatch('stopFetching', 'favorites')
      this.$store.dispatch('stopFetching', 'media')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.commit('clearTimeline', { timeline: 'favorites' })
      this.$store.commit('clearTimeline', { timeline: 'media' })
      this.$store.dispatch('startFetching', ['user', this.fetchBy])
      this.$store.dispatch('startFetching', ['media', this.fetchBy])
      this.startFetchFavorites()
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
