import UserCard from '../user_card/user_card.vue'

const FollowRequests = {
  data () {
    return {
      requests: []
    }
  },
  components: {
    UserCard
  },
  created () {
    this.$store.state.api.backendInteractor.fetchFollowRequests()
      .then((requests) => { this.requests = requests })
  }
}

export default FollowRequests
