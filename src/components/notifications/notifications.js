import { mapGetters } from 'vuex'
import Notification from '../notification/notification.vue'
import notificationsFetcher from '../../services/notifications_fetcher/notifications_fetcher.service.js'
import {
  notificationsFromStore,
  filteredNotificationsFromStore,
  unseenNotificationsFromStore
} from '../../services/notification_utils/notification_utils.js'

const DEFAULT_SEEN_TO_DISPLAY_COUNT = 30

const Notifications = {
  props: {
    // Disables display of panel header
    noHeading: Boolean,
    // Disables panel styles, unread mark, potentially other notification-related actions
    // meant for "Interactions" timeline
    minimalMode: Boolean,
    // Custom filter mode, an array of strings, possible values 'mention', 'repeat', 'like', 'follow', used to override global filter for use in "Interactions" timeline
    filterMode: Array
  },
  data () {
    return {
      bottomedOut: false,
      // How many seen notifications to display in the list. The more there are,
      // the heavier the page becomes. This count is increased when loading
      // older notifications, and cut back to default whenever hitting "Read!".
      seenToDisplayCount: DEFAULT_SEEN_TO_DISPLAY_COUNT
    }
  },
  created () {
    const store = this.$store
    const credentials = store.state.users.currentUser.credentials
    notificationsFetcher.fetchAndUpdate({ store, credentials })
  },
  computed: {
    mainClass () {
      return this.minimalMode ? '' : 'panel panel-default'
    },
    notifications () {
      return notificationsFromStore(this.$store)
    },
    error () {
      return this.$store.state.statuses.notifications.error
    },
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    filteredNotifications () {
      return filteredNotificationsFromStore(this.$store, this.filterMode)
    },
    unseenCount () {
      return this.unseenNotifications.length
    },
    unseenCountTitle () {
      return this.unseenCount + (this.unreadChatCount)
    },
    loading () {
      return this.$store.state.statuses.notifications.loading
    },
    notificationsToDisplay () {
      return this.filteredNotifications.slice(0, this.unseenCount + this.seenToDisplayCount)
    },
    ...mapGetters(['unreadChatCount'])
  },
  components: {
    Notification
  },
  watch: {
    unseenCountTitle (count) {
      if (count > 0) {
        this.$store.dispatch('setPageTitle', `(${count})`)
      } else {
        this.$store.dispatch('setPageTitle', '')
      }
    }
  },
  methods: {
    markAsSeen () {
      this.$store.dispatch('markNotificationsAsSeen')
      this.seenToDisplayCount = DEFAULT_SEEN_TO_DISPLAY_COUNT
    },
    fetchOlderNotifications () {
      if (this.loading) {
        return
      }

      const seenCount = this.filteredNotifications.length - this.unseenCount
      if (this.seenToDisplayCount < seenCount) {
        this.seenToDisplayCount = Math.min(this.seenToDisplayCount + 20, seenCount)
        return
      } else if (this.seenToDisplayCount > seenCount) {
        this.seenToDisplayCount = seenCount
      }

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
        this.seenToDisplayCount += notifs.length
      })
    }
  }
}

export default Notifications
