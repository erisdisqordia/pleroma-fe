import UserCardContent from '../user_card_content/user_card_content.vue'
import UserCard from '../user_card/user_card.vue'
import Timeline from '../timeline/timeline.vue'
import FollowList from '../follow_list/follow_list.vue'

const UserProfile = {
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.commit('clearTimeline', { timeline: 'favorites' })
    this.$store.commit('clearTimeline', { timeline: 'media' })
    this.$store.dispatch('startFetching', { timeline: 'user', userId: this.fetchBy })
    this.$store.dispatch('startFetching', { timeline: 'media', userId: this.fetchBy })
    this.startFetchFavorites()
    if (!this.user.id) {
      this.$store.dispatch('fetchUser', this.fetchBy)
    }
  },
  destroyed () {
    this.cleanUp()
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
    },
    followsTabVisible () {
      return this.isUs || !this.user.hide_follows
    },
    followersTabVisible () {
      return this.isUs || !this.user.hide_followers
    }
  },
  methods: {
    startFetchFavorites () {
      if (this.isUs) {
        this.$store.dispatch('startFetching', { timeline: 'favorites', userId: this.fetchBy })
      }
    },
    startUp () {
      this.$store.dispatch('startFetching', { timeline: 'user', userId: this.fetchBy })
      this.$store.dispatch('startFetching', { timeline: 'media', userId: this.fetchBy })

      this.startFetchFavorites()
    },
    cleanUp () {
      this.$store.dispatch('stopFetching', 'user')
      this.$store.dispatch('stopFetching', 'favorites')
      this.$store.dispatch('stopFetching', 'media')
      this.$store.commit('clearTimeline', { timeline: 'user' })
      this.$store.commit('clearTimeline', { timeline: 'favorites' })
      this.$store.commit('clearTimeline', { timeline: 'media' })
    }
  },
  watch: {
    userName () {
      if (this.isExternal) {
        return
      }
      this.cleanUp()
      this.startUp()
    },
    userId () {
      if (!this.isExternal) {
        return
      }
      this.cleanUp()
      this.startUp()
    }
  },
  components: {
    UserCardContent,
    UserCard,
    Timeline,
    FollowList
  }
}

export default UserProfile
