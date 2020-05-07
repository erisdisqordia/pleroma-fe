const FeaturesPanel = {
  computed: {
    chat: function () { return this.$store.state.instance.chatAvailable },
    pleromaChatMessages: function () { return this.$store.state.instance.pleromaChatMessagesAvailable },
    gopher: function () { return this.$store.state.instance.gopherAvailable },
    whoToFollow: function () { return this.$store.state.instance.suggestionsEnabled },
    mediaProxy: function () { return this.$store.state.instance.mediaProxyAvailable },
    minimalScopesMode: function () { return this.$store.state.instance.minimalScopesMode },
    textlimit: function () { return this.$store.state.instance.textlimit }
  }
}

export default FeaturesPanel
