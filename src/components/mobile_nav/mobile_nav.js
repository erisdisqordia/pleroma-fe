import SideDrawer from '../side_drawer/side_drawer.vue'
import Notifications from '../notifications/notifications.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'

const MobileNav = {
  components: {
    SideDrawer,
    Notifications
  },
  data: () => ({
    notificationsOpen: false
  }),
  computed: {
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    unseenNotificationsCount () {
      return this.unseenNotifications.length
    },
    sitename () { return this.$store.state.instance.name }
  },
  methods: {
    toggleMobileSidebar () {
      this.$refs.sideDrawer.toggleDrawer()
    },
    toggleMobileNotifications () {
      this.notificationsOpen = !this.notificationsOpen
    },
    scrollToTop () {
      window.scrollTo(0, 0)
    }
  }
}

export default MobileNav
