import UserCardContent from '../user_card_content/user_card_content.vue'

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
    },
    denyUser () {
      this.$store.state.api.backendInteractor.denyUser(this.user.id)
    }
  }
}

export default UserCard
