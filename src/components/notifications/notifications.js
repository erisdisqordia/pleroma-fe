import { sortBy, take, filter } from 'lodash'
import Status from '../status/status.vue'

const Notifications = {
  data () {
    return {
      visibleNotificationCount: 10
    }
  },
  components: {
    Status
  },
  computed: {
    notifications () {
      return this.$store.state.statuses.notifications
    },
    unseenNotifications () {
      return filter(this.notifications, ({seen}) => !seen)
    },
    visibleNotifications () {
      // Don't know why, but sortBy([seen, -action.id]) doesn't work.
      let sortedNotifications = sortBy(this.notifications, ({action}) => -action.id)
      sortedNotifications = sortBy(sortedNotifications, 'seen')
      return take(sortedNotifications, this.visibleNotificationCount)
    },
    unseenCount () {
      return this.unseenNotifications.length
    }
  },
  watch: {
    unseenCount (count) {
      if (count > 0) {
        this.$store.dispatch('setPageTitle', `(${count})`)
      } else {
        this.$store.dispatch('setPageTitle', '')
      }
    }
  },
  methods: {
    markAsSeen () {
      this.$store.commit('markNotificationsAsSeen', this.visibleNotifications)
    }
  }
}

export default Notifications
