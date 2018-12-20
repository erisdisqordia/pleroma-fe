const SideDrawer = {
  props: [ 'activatePanel', 'closed', 'clickoutside' ],
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
    }
  }
}

export default SideDrawer
