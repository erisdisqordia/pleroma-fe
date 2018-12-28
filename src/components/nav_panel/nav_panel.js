const NavPanel = {
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    chat () {
      return this.$store.state.chat.channel
    }
  }
}

export default NavPanel
