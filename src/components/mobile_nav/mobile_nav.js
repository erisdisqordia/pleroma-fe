import SideDrawer from '../side_drawer/side_drawer.vue'
import Notifications from '../notifications/notifications.vue'
import MobilePostStatusModal from '../mobile_post_status_modal/mobile_post_status_modal.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'

const MobileNav = {
  components: {
    SideDrawer,
    Notifications,
    MobilePostStatusModal
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
      if (!this.notificationsOpen) {
        this.markNotificationsAsSeen()
      }
    },
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    logout () {
      this.$router.replace('/main/public')
      this.$store.dispatch('logout')
    },
    markNotificationsAsSeen () {
      this.$refs.notifications.markAsSeen()
    }
  }
}

export default MobileNav
