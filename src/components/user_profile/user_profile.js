import UserCardContent from '../user_card_content/user_card_content.vue'

const UserProfile = {
  created () {
    this.$store.dispatch('startFetching', ['user', this.userId])
  },
  destroyed () {
    this.$store.dispatch('stopFetching', ['user', this.userId])
  },
  computed: {
    userId () {
      return this.$route.params.id
    },
    user () {
      return this.$store.state.users.usersObject[this.userId]
    }
  },
  components: {
    UserCardContent
  }
}

export default UserProfile
