import FollowRequestCard from '../follow_request_card/follow_request_card.vue'

const FollowRequests = {
  components: {
    FollowRequestCard
  },
  computed: {
    requests () {
      return this.$store.state.api.followRequests
    }
  }
}

export default FollowRequests
