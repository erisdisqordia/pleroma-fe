import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import StyleSwitcher from './components/style_switcher/style_switcher.vue'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    StyleSwitcher
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    style () { return { 'background-image': `url(${this.currentUser.background_image})` } }
  }
}
