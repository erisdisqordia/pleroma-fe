const MRFTransparencyPanel = {
  components: {
  },
  computed: {
    federationPolicy () {
      return this.$store.state.instance.federationPolicy
    },
    mrfPolicies () {
      return this.$store.state.instance.federationPolicy.mrf_policies
    },
    acceptInstances () {
      return this.$store.state.instance.federationPolicy.mrf_simple.accept
    },
    rejectInstances () {
      return this.$store.state.instance.federationPolicy.mrf_simple.reject
    },
    quarantineInstances () {
      return this.$store.state.instance.federationPolicy.quarantined_instances
    },
    ftlRemovalInstances () {
      return this.$store.state.instance.federationPolicy.mrf_simple.federated_timeline_removal
    },
    mediaNsfwInstances () {
      return this.$store.state.instance.federationPolicy.mrf_simple.media_nsfw
    },
    mediaRemovalInstances () {
      return this.$store.state.instance.federationPolicy.mrf_simple.media_removal
    }
  }
}

export default MRFTransparencyPanel
