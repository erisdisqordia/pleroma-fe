import { sortBy, take } from 'lodash'

const Notifications = {
  data () {
    return {
      visibleNotificationCount: 20
    }
  },
  computed: {
    visibleNotifications () {
      return take(sortBy(this.$store.state.statuses.notifications, ({action}) => -action.id), this.visibleNotificationCount)
    }
  }
}

export default Notifications
