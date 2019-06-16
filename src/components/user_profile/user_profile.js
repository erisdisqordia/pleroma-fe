import get from 'lodash/get'
import UserCard from '../user_card/user_card.vue'
import FollowCard from '../follow_card/follow_card.vue'
import Timeline from '../timeline/timeline.vue'
import Conversation from '../conversation/conversation.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'
import List from '../list/list.vue'
import withLoadMore from '../../hocs/with_load_more/with_load_more'

const FollowerList = withLoadMore({
  fetch: (props, $store) => $store.dispatch('fetchFollowers', props.userId),
  select: (props, $store) => get($store.getters.findUser(props.userId), 'followerIds', []).map(id => $store.getters.findUser(id)),
  destroy: (props, $store) => $store.dispatch('clearFollowers', props.userId),
  childPropName: 'items',
  additionalPropNames: ['userId']
})(List)

const FriendList = withLoadMore({
  fetch: (props, $store) => $store.dispatch('fetchFriends', props.userId),
  select: (props, $store) => get($store.getters.findUser(props.userId), 'friendIds', []).map(id => $store.getters.findUser(id)),
  destroy: (props, $store) => $store.dispatch('clearFriends', props.userId),
  childPropName: 'items',
  additionalPropNames: ['userId']
})(List)

const UserProfile = {
  data () {
    return {
      error: false,
      userId: null
    }
  },
  created () {
    const routeParams = this.$route.params
    this.load(routeParams.name || routeParams.id)
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
    isUs () {
      return this.userId && this.$store.state.users.currentUser.id &&
        this.userId === this.$store.state.users.currentUser.id
    },
    user () {
      return this.$store.getters.findUser(this.userId)
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
    load (userNameOrId) {
      // Check if user data is already loaded in store
      const user = this.$store.getters.findUser(userNameOrId)
      if (user) {
        this.userId = user.id
        this.fetchTimelines()
      } else {
        this.$store.dispatch('fetchUser', userNameOrId)
          .then(({ id }) => {
            this.userId = id
            this.fetchTimelines()
          })
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
    fetchTimelines () {
      const userId = this.userId
      this.$store.dispatch('startFetchingTimeline', { timeline: 'user', userId })
      this.$store.dispatch('startFetchingTimeline', { timeline: 'media', userId })
      if (this.isUs) {
        this.$store.dispatch('startFetchingTimeline', { timeline: 'favorites', userId })
      }
      // Fetch all pinned statuses immediately
      this.$store.dispatch('fetchPinnedStatuses', userId)
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
    '$route.params.id': function (newVal) {
      if (newVal) {
        this.cleanUp()
        this.load(newVal)
      }
    },
    '$route.params.name': function (newVal) {
      if (newVal) {
        this.cleanUp()
        this.load(newVal)
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
    ModerationTools,
    FollowCard,
    Conversation
  }
}

export default UserProfile
