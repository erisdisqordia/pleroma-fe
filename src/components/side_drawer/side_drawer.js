const SideDrawer = {
  props: [ 'activatePanel', 'closed' ],
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    chat () {
      return this.$store.state.chat.channel
    }
  }
}

export default SideDrawer
