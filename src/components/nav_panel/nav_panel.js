const NavPanel = {
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    chat () {
      return this.$store.state.chat.channel
    },
    showDMs () {
      return this.$store.state.instance.scopeOptionsEnabled
    }
  }
}

export default NavPanel
