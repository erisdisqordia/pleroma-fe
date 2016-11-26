const NavPanel = {
  computed: {
    loggedIn () {
      return this.$store.state.users.currentUser
    }
  }
}

export default NavPanel
