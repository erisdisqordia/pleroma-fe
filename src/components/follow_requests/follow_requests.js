import UserCard from '../user_card/user_card.vue'

const FollowRequests = {
  components: {
    UserCard
  },
  computed: {
    requests () {
      return this.$store.state.api.followRequests
    }
  }
}

export default FollowRequests
