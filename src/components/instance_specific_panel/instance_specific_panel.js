const InstanceSpecificPanel = {
  computed: {
    instanceSpecificPanelContent () {
      return this.$store.state.config.instanceSpecificPanelContent
    }
  }
}

export default InstanceSpecificPanel
