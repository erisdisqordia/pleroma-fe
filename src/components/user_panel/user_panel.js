import LoginForm from '../login_form/login_form.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'

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
    LoginForm,
    PostStatusForm
  }
}

export default UserPanel
