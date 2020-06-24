import get from 'lodash/get'
import UserCard from '../user_card/user_card.vue'
import FollowCard from '../follow_card/follow_card.vue'
import Timeline from '../timeline/timeline.vue'
import Conversation from '../conversation/conversation.vue'
import TabSwitcher from 'src/components/tab_switcher/tab_switcher.js'
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

const defaultTabKey = 'statuses'

const UserProfile = {
  data () {
    return {
      error: false,
      userId: null,
      tab: defaultTabKey
    }
  },
  created () {
    const routeParams = this.$route.params
    this.load(routeParams.name || routeParams.id)
    this.tab = get(this.$route, 'query.tab', defaultTabKey)
  },
  destroyed () {
    this.stopFetching()
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
      const startFetchingTimeline = (timeline, userId) => {
        // Clear timeline only if load another user's profile
        if (userId !== this.$store.state.statuses.timelines[timeline].userId) {
          this.$store.commit('clearTimeline', { timeline })
        }
        this.$store.dispatch('startFetchingTimeline', { timeline, userId })
      }

      const loadById = (userId) => {
        this.userId = userId
        startFetchingTimeline('user', userId)
        startFetchingTimeline('media', userId)
        if (this.isUs) {
          startFetchingTimeline('favorites', userId)
        }
        // Fetch all pinned statuses immediately
        this.$store.dispatch('fetchPinnedStatuses', userId)
      }

      // Reset view
      this.userId = null
      this.error = false

      // Check if user data is already loaded in store
      const user = this.$store.getters.findUser(userNameOrId)
      if (user) {
        loadById(user.id)
      } else {
        this.$store.dispatch('fetchUser', userNameOrId)
          .then(({ id }) => loadById(id))
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
    stopFetching () {
      this.$store.dispatch('stopFetchingTimeline', 'user')
      this.$store.dispatch('stopFetchingTimeline', 'favorites')
      this.$store.dispatch('stopFetchingTimeline', 'media')
    },
    switchUser (userNameOrId) {
      this.stopFetching()
      this.load(userNameOrId)
    },
    onTabSwitch (tab) {
      this.tab = tab
      this.$router.replace({ query: { tab } })
    },
    linkClicked ({ target }) {
      if (target.tagName === 'SPAN') {
        target = target.parentNode
      }
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    }
  },
  watch: {
    '$route.params.id': function (newVal) {
      if (newVal) {
        this.switchUser(newVal)
      }
    },
    '$route.params.name': function (newVal) {
      if (newVal) {
        this.switchUser(newVal)
      }
    },
    '$route.query': function (newVal) {
      this.tab = newVal.tab || defaultTabKey
    }
  },
  components: {
    UserCard,
    Timeline,
    FollowerList,
    FriendList,
    FollowCard,
    TabSwitcher,
    Conversation
  }
}

export default UserProfile
