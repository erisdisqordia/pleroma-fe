const FeaturesPanel = {
  computed: {
    chat: function () {
      return this.$store.state.config.chatAvailable && (!this.$store.state.chatDisabled)
    },
    gopher: function () { return this.$store.state.config.gopherAvailable },
    whoToFollow: function () { return this.$store.state.config.suggestionsEnabled },
    mediaProxy: function () { return this.$store.state.config.mediaProxyAvailable },
    scopeOptions: function () { return this.$store.state.config.scopeOptionsEnabled },
    textlimit: function () { return this.$store.state.config.textlimit }
  }
}

export default FeaturesPanel
