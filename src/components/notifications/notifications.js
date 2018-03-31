import Status from '../status/status.vue'
import StillImage from '../still-image/still-image.vue'

import { sortBy, take, filter } from 'lodash'

const Notifications = {
  data () {
    return {
      visibleNotificationCount: 10
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
    },
    hiderStyle () {
      return {
        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${this.$store.state.config.colors.bg} 80%)`
      }
    }
  },
  components: {
    Status, StillImage
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
