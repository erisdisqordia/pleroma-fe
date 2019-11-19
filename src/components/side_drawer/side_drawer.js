import UserCard from '../user_card/user_card.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'
import GestureService from '../../services/gesture_service/gesture_service'

const SideDrawer = {
  props: [ 'logout' ],
  data: () => ({
    closed: true,
    closeGesture: undefined
  }),
  created () {
    this.closeGesture = GestureService.swipeGesture(GestureService.DIRECTION_LEFT, this.toggleDrawer)

    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequest')
    }
  },
  components: { UserCard },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    chat () { return this.$store.state.chat.channel.state === 'joined' },
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    unseenNotificationsCount () {
      return this.unseenNotifications.length
    },
    suggestionsEnabled () {
      return this.$store.state.instance.suggestionsEnabled
    },
    logo () {
      return this.$store.state.instance.logo
    },
    sitename () {
      return this.$store.state.instance.name
    },
    followRequestCount () {
      return this.$store.state.api.followRequests.length
    }
  },
  methods: {
    toggleDrawer () {
      this.closed = !this.closed
    },
    doLogout () {
      this.logout()
      this.toggleDrawer()
    },
    touchStart (e) {
      GestureService.beginSwipe(e, this.closeGesture)
    },
    touchMove (e) {
      GestureService.updateSwipe(e, this.closeGesture)
    }
  }
}

export default SideDrawer
