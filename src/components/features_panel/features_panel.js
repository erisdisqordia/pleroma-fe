const FeaturesPanel = {
  computed: {
    chat: function () {
      return this.$store.state.instance.chatAvailable && (!this.$store.state.chatDisabled)
    },
    gopher: function () { return this.$store.state.instance.gopherAvailable },
    whoToFollow: function () { return this.$store.state.instance.suggestionsEnabled },
    mediaProxy: function () { return this.$store.state.instance.mediaProxyAvailable },
    scopeOptionsMinimal: function () { return this.$store.state.instance.scopeOptionsMinimal },
    textlimit: function () { return this.$store.state.instance.textlimit }
  }
}

export default FeaturesPanel
