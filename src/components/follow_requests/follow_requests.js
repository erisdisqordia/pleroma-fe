import FollowRequestCard from '../follow_request_card/follow_request_card.vue'
import List from '../list/list.vue'

const FollowRequests = {
  components: {
    FollowRequestCard,
    List
  },
  computed: {
    requests () {
      return this.$store.state.api.followRequests
    }
  }
}

export default FollowRequests
