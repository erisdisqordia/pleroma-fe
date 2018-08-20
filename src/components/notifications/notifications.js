import Notification from '../notification/notification.vue'
import notificationsFetcher from '../../services/notifications_fetcher/notifications_fetcher.service.js'

import { sortBy, filter } from 'lodash'

const Notifications = {
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials

    notificationsFetcher.startFetching({ store, credentials })
  },
  computed: {
    notifications () {
      return this.$store.state.statuses.notifications.data
    },
    error () {
      return this.$store.state.statuses.notifications.error
    },
    unseenNotifications () {
      return filter(this.notifications, ({seen}) => !seen)
    },
    visibleNotifications () {
      // Don't know why, but sortBy([seen, -action.id]) doesn't work.
      let sortedNotifications = sortBy(this.notifications, ({action}) => -action.id)
      sortedNotifications = sortBy(sortedNotifications, 'seen')
      return sortedNotifications
    },
    unseenCount () {
      return this.unseenNotifications.length
    }
  },
  components: {
    Notification
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
    },
    fetchOlderNotifications () {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials
      notificationsFetcher.fetchAndUpdate({
        store,
        credentials,
        older: true
      })
    }
  }
}

export default Notifications
