const TermsOfServicePanel = {
  computed: {
    content () {
      return this.$store.state.instance.tos
    }
  }
}

export default TermsOfServicePanel
