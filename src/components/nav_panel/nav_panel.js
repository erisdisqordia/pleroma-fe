import followRequestFetcher from '../../services/follow_request_fetcher/follow_request_fetcher.service'
import { mapState } from 'vuex'

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials

      followRequestFetcher.startFetching({ store, credentials })
    }
  },
  computed: mapState({
    currentUser: state => state.users.currentUser,
    chat: state => state.chat.channel,
    followRequestCount: state => state.api.followRequests.length,
    privateMode: state => state.instance.private,
    federating: state => state.instance.federationPolicy.federating || true
  })
}

export default NavPanel
