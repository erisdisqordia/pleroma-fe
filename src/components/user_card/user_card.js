import UserCardContent from '../user_card_content/user_card_content.vue'
import StillImage from '../still-image/still-image.vue'

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
    UserCardContent,
    StillImage
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser }
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
  }
}

export default UserCard
