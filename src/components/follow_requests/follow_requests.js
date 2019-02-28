import FollowRequestCard from '../follow_request_card/follow_request_card.vue'

const FollowRequests = {
  components: {
    FollowRequestCard
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
