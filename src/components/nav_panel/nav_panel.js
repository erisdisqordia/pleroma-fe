const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequest')
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
