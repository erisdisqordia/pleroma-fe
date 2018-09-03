const FeaturesPanel = {
  computed: {
    mediaProxy: function () { return this.$store.state.config.mediaProxyAvailable },
    whoToFollow: function () { return this.$store.state.config.suggestionsEnabled },
    scopeOptions: function () { return this.$store.state.config.scopeOptionsEnabled },
    formattingOptions: function () { return this.$store.state.config.formattingOptionsEnabled },
    textlimit: function () { return this.$store.state.config.textlimit }
  }
}

export default FeaturesPanel
