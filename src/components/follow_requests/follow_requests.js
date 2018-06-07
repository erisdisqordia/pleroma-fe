import UserCard from '../user_card/user_card.vue'

const FollowRequests = {
  components: {
    UserCard
  },
  created () {
    this.updateRequests()
  },
  computed: {
    requests () {
      return this.$store.state.api.followRequests
    }
  },
  methods: {
    updateRequests () {
      this.$store.state.api.backendInteractor.fetchFollowRequests()
        .then((requests) => { this.$store.commit('setFollowRequests', requests) })
    }
  }
}

export default FollowRequests
