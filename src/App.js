import UserPanel from './components/user_panel/user_panel.vue'

export default {
  name: 'app',
  components: {
    UserPanel
  },
  computed: {
    user () { return this.$store.state.users.currentUser || {} },
    style () { return { 'background-image': `url(${this.user.background_image})` } }
  }
}
