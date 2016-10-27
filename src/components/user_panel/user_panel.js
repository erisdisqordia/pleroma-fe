import LoginForm from '../login_form/login_form.vue'

const UserPanel = {
  computed: {
    user () { return this.$store.state.users.currentUser },
    style () {
      return {
        color: `#${this.user.profile_link_color}`,
        'background-image': `url(${this.user.cover_photo})`
      }
    }
  },
  components: {
    LoginForm
  }
}

export default UserPanel
