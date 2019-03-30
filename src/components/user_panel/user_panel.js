import LoginForm from '../login_form/login_form.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCard from '../user_card/user_card.vue'

const UserPanel = {
  computed: {
    user () { return this.$store.state.users.currentUser }
  },
  components: {
    LoginForm,
    PostStatusForm,
    UserCard
  }
}

export default UserPanel
