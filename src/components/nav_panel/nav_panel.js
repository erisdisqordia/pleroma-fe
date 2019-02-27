import requestFetcher from '../../services/notifications_fetcher/request_fetcher.service.js'

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      const store = this.$store
      const credentials = store.state.users.currentUser.credentials

      requestFetcher.startFetching({ store, credentials })
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    chat () {
      return this.$store.state.chat.channel
    },
    followRequestCount () {
      return this.$store.state.api.followRequests.length
    }
  }
}

export default NavPanel
