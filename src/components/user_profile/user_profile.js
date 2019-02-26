import { compose } from 'vue-compose'
import get from 'lodash/get'
import UserCardContent from '../user_card_content/user_card_content.vue'
import FollowCard from '../follow_card/follow_card.vue'
import Timeline from '../timeline/timeline.vue'
import withLoadMore from '../../hocs/with_load_more/with_load_more'
import withList from '../../hocs/with_list/with_list'

const FollowerList = compose(
  withLoadMore({
    fetch: (props, $store) => $store.dispatch('addFollowers', props.userId),
    select: (props, $store) => get($store.getters.userById(props.userId), 'followers', []),
    destory: (props, $store) => $store.dispatch('clearFollowers', props.userId),
    childPropName: 'entries',
    additionalPropNames: ['userId']
  }),
  withList({ getEntryProps: user => ({ user }) })
)(FollowCard)

const FriendList = compose(
  withLoadMore({
    fetch: (props, $store) => $store.dispatch('addFriends', props.userId),
    select: (props, $store) => get($store.getters.userById(props.userId), 'friends', []),
    destory: (props, $store) => $store.dispatch('clearFriends', props.userId),
    childPropName: 'entries',
    additionalPropNames: ['userId']
  }),
  withList({ getEntryProps: user => ({ user }) })
)(FollowCard)

const UserProfile = {
  data () {
    return {
      error: false
    }
  },
  created () {
    this.$store.commit('clearTimeline', { timeline: 'user' })
    this.$store.commit('clearTimeline', { timeline: 'favorites' })
    this.$store.commit('clearTimeline', { timeline: 'media' })
    this.$store.dispatch('startFetching', { timeline: 'user', userId: this.fetchBy })
    this.$store.dispatch('startFetching', { timeline: 'media', userId: this.fetchBy })
    this.startFetchFavorites()
    if (!this.user.id) {
      this.$store.dispatch('fetchUser', this.fetchBy)
        .catch((reason) => {
          const errorMessage = get(reason, 'error.error')
          if (errorMessage === 'No user with such user_id') { // Known error
            this.error = this.$t('user_profile.profile_does_not_exist')
          } else if (errorMessage) {
            this.error = errorMessage
          } else {
            this.error = this.$t('user_profile.profile_loading_error')
          }
        })
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
    Timeline,
    FollowerList,
    FriendList
  }
}

export default UserProfile
