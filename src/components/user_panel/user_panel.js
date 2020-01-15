import AuthForm from '../auth_form/auth_form.js'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import UserCard from '../user_card/user_card.vue'
import { mapState } from 'vuex'

const UserPanel = {
  computed: {
    signedIn () { return this.user },
    ...mapState({ user: state => state.users.currentUser })
  },
  components: {
    AuthForm,
    PostStatusForm,
    UserCard
  }
}

export default UserPanel
