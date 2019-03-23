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
    currentUser () {
      return this.$store.state.users.currentUser
    },
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
    openMobileNotifications () {
      this.notificationsOpen = true
    },
    closeMobileNotifications () {
      if (this.notificationsOpen) {
        // make sure to mark notifs seen only when the notifs were open and not
        // from close-calls.
        this.notificationsOpen = false
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
  },
  watch: {
    $route () {
      // handles closing notificaitons when you press any router-link on the
      // notifications.
      this.closeMobileNotifications()
    }
  }
}

export default MobileNav
