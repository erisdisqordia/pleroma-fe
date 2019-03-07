import UserCard from '../user_card/user_card.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'

// TODO: separate touch gesture stuff into their own utils if more components want them
const deltaCoord = (oldCoord, newCoord) => [newCoord[0] - oldCoord[0], newCoord[1] - oldCoord[1]]

const touchEventCoord = e => ([e.touches[0].screenX, e.touches[0].screenY])

const SideDrawer = {
  props: [ 'logout' ],
  data: () => ({
    closed: true,
    touchCoord: [0, 0]
  }),
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
      this.touchCoord = touchEventCoord(e)
    },
    touchMove (e) {
      const delta = deltaCoord(this.touchCoord, touchEventCoord(e))
      if (delta[0] < -30 && Math.abs(delta[1]) < Math.abs(delta[0]) && !this.closed) {
        this.toggleDrawer()
      }
    }
  }
}

export default SideDrawer
