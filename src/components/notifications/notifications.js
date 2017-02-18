import { sortBy, take, filter } from 'lodash'

const Notifications = {
  data () {
    return {
      visibleNotificationCount: 20
    }
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
      this.$store.dispatch('setPageTitle', `(${count})`)
      if (count==0) this.$store.dispatch('setPageTitle', '')
    }
  },
  methods: {
    markAsSeen () {
      this.$store.commit('markNotificationsAsSeen', this.visibleNotifications)
    }
  }
}

export default Notifications
