const InstanceSpecificPanel = {
  computed: {
    instanceSpecificPanelContent () {
      return this.$store.state.instance.instanceSpecificPanelContent
    },
    show () {
      return !this.$store.state.config.hideISP
    }
  }
}

export default InstanceSpecificPanel
