import LoginForm from '../login_form/login_form.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'

const UserPanel = {
  computed: {
    user () { return this.$store.state.users.currentUser }
  },
  components: {
    LoginForm,
    PostStatusForm,
    UserCardContent
  }
}

export default UserPanel
