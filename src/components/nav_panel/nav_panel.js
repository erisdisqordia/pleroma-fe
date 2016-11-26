const NavPanel = {
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    }
  }
}

export default NavPanel
