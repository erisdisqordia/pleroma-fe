const InstanceSpecificPanel = {
  computed: {
    instanceSpecificPanelContent () {
      return this.$store.state.instance.instanceSpecificPanelContent
    }
  }
}

export default InstanceSpecificPanel
