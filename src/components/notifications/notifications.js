import Notification from '../notification/notification.vue'
import notificationsFetcher from '../../services/notifications_fetcher/notifications_fetcher.service.js'
import {
  notificationsFromStore,
  visibleNotificationsFromStore,
  unseenNotificationsFromStore
} from '../../services/notification_utils/notification_utils.js'

const Notifications = {
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials

    notificationsFetcher.startFetching({ store, credentials })
  },
  data () {
    return {
      bottomedOut: false
    }
  },
  computed: {
    notifications () {
      return notificationsFromStore(this.$store)
    },
    error () {
      return this.$store.state.statuses.notifications.error
    },
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    visibleNotifications () {
      return visibleNotificationsFromStore(this.$store)
    },
    unseenCount () {
      return this.unseenNotifications.length
    },
    loading () {
      return this.$store.state.statuses.notifications.loading
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
      this.$store.dispatch('markNotificationsAsSeen', this.visibleNotifications)
    },
    fetchOlderNotifications () {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials
      store.commit('setNotificationsLoading', { value: true })
      notificationsFetcher.fetchAndUpdate({
        store,
        credentials,
        older: true
      }).then(notifs => {
        store.commit('setNotificationsLoading', { value: false })
        if (notifs.length === 0) {
          this.bottomedOut = true
        }
      })
    }
  }
}

export default Notifications
