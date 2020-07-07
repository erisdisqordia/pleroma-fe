import SideDrawer from '../side_drawer/side_drawer.vue'
import Notifications from '../notifications/notifications.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'
import GestureService from '../../services/gesture_service/gesture_service'

const MobileNav = {
  components: {
    SideDrawer,
    Notifications
  },
  data: () => ({
    notificationsCloseGesture: undefined,
    notificationsOpen: false
  }),
  created () {
    this.notificationsCloseGesture = GestureService.swipeGesture(
      GestureService.DIRECTION_RIGHT,
      this.closeMobileNotifications,
      50
    )
  },
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
    hideSitename () { return this.$store.state.instance.hideSitename },
    sitename () { return this.$store.state.instance.name },
    isChat () {
      return this.$route.name === 'chat'
    }
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
    notificationsTouchStart (e) {
      GestureService.beginSwipe(e, this.notificationsCloseGesture)
    },
    notificationsTouchMove (e) {
      GestureService.updateSwipe(e, this.notificationsCloseGesture)
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
    },
    onScroll ({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (this.$store.getters.mergedConfig.autoLoad && scrollTop + clientHeight >= scrollHeight) {
        this.$refs.notifications.fetchOlderNotifications()
      }
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
