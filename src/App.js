import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel
  },
  computed: {
    user () { return this.$store.state.users.currentUser || {} },
    style () { return { 'background-image': `url(${this.user.background_image})` } }
  }
}
