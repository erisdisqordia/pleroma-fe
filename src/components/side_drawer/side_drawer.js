const SideDrawer = {
  props: [ 'activatePanel', 'closed', 'clickoutside', 'logout' ],
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    gotoPanel (panel) {
      this.activatePanel(panel)
      this.clickoutside && this.clickoutside()
    },
    clickedOutside () {
      if (typeof this.clickoutside === 'function') {
        this.clickoutside()
      }
    },
    doLogout () {
      this.logout()
      this.gotoPanel('timeline')
    }
  }
}

export default SideDrawer
