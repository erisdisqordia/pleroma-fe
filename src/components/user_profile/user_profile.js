import { compose } from 'vue-compose'
import get from 'lodash/get'
import UserCard from '../user_card/user_card.vue'
import FollowCard from '../follow_card/follow_card.vue'
import Timeline from '../timeline/timeline.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'
import withLoadMore from '../../hocs/with_load_more/with_load_more'
import withList from '../../hocs/with_list/with_list'

const FollowerList = compose(
  withLoadMore({
    fetch: (props, $store) => $store.dispatch('addFollowers', props.userId),
    select: (props, $store) => get($store.getters.findUser(props.userId), 'followers', []),
    destory: (props, $store) => $store.dispatch('clearFollowers', props.userId),
    childPropName: 'entries',
    additionalPropNames: ['userId']
  }),
  withList({ getEntryProps: user => ({ user }) })
)(FollowCard)

const FriendList = compose(
  withLoadMore({
    fetch: (props, $store) => $store.dispatch('addFriends', props.userId),
    select: (props, $store) => get($store.getters.findUser(props.userId), 'friends', []),
    destory: (props, $store) => $store.dispatch('clearFriends', props.userId),
    childPropName: 'entries',
    additionalPropNames: ['userId']
  }),
  withList({ getEntryProps: user => ({ user }) })
)(FollowCard)

const UserProfile = {
  data () {
    return {
      error: false,
      fetchedUserId: null
    }
  },
  created () {
    if (!this.user.id) {
      this.fetchUserId()
        .then(() => this.startUp())
    } else {
      this.startUp()
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
      return this.$route.params.id || this.user.id || this.fetchedUserId
    },
    userName () {
      return this.$route.params.name || this.user.screen_name
    },
    isUs () {
      return this.userId && this.$store.state.users.currentUser.id &&
        this.userId === this.$store.state.users.currentUser.id
    },
    userInStore () {
      const routeParams = this.$route.params
      // This needs fetchedUserId so that computed will be refreshed when user is fetched
      return this.$store.getters.findUser(this.fetchedUserId || routeParams.name || routeParams.id)
    },
    user () {
      if (this.userInStore) {
        return this.userInStore
      }
      return {}
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
        this.$store.dispatch('startFetchingTimeline', { timeline: 'favorites', userId: this.userId })
      }
    },
    fetchUserId () {
      let fetchPromise
      if (this.userId && !this.$route.params.name) {
        fetchPromise = this.$store.dispatch('fetchUser', this.userId)
      } else {
        fetchPromise = this.$store.dispatch('fetchUser', this.userName)
          .then(({ id }) => {
            this.fetchedUserId = id
          })
      }
      return fetchPromise
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
        .then(() => this.startUp())
    },
    startUp () {
      if (this.userId) {
        this.$store.dispatch('startFetchingTimeline', { timeline: 'user', userId: this.userId })
        this.$store.dispatch('startFetchingTimeline', { timeline: 'media', userId: this.userId })
        this.startFetchFavorites()
      }
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
    // userId can be undefined if we don't know it yet
    userId (newVal) {
      if (newVal) {
        this.cleanUp()
        this.startUp()
      }
    },
    userName () {
      if (this.$route.params.name) {
        this.fetchUserId()
        this.cleanUp()
        this.startUp()
      }
    },
    $route () {
      this.$refs.tabSwitcher.activateTab(0)()
    }
  },
  components: {
    UserCard,
    Timeline,
    FollowerList,
    FriendList,
    ModerationTools
  }
}

export default UserProfile
