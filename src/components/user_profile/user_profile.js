import UserCardContent from '../user_card_content/user_card_content.vue'
import { find } from 'lodash'

const UserProfile = {
  computed: {
    user () {
      const id = this.$route.params.id
      const user = find(this.$store.state.users.users, {id})
      return user
    }
  },
  components: {
    UserCardContent
  }
}

export default UserProfile
