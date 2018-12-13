import UserCardContent from '../user_card_content/user_card_content.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const UserCard = {
  props: [
    'user',
    'showFollows',
    'showApproval'
  ],
  data () {
    return {
      userExpanded: false
    }
  },
  components: {
    UserCardContent
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    approveUser () {
      this.$store.state.api.backendInteractor.approveUser(this.user.id)
      this.$store.dispatch('removeFollowRequest', this.user)
    },
    denyUser () {
      this.$store.state.api.backendInteractor.denyUser(this.user.id)
      this.$store.dispatch('removeFollowRequest', this.user)
    }
  },
  computed: {
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name)
    }
  }
}

export default UserCard
