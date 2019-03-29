const EmojiSelector = {
  data () {
    return {
      open: false
    }
  },
  mounted () {
    console.log(this.$store.state.instance.emoji)
    console.log(this.$store.state.instance.customEmoji)
  },
  methods: {
    togglePanel () {
      this.open = !this.open
    }
  },
  computed: {
    standardEmoji () {
      return this.$store.state.instance.emoji || []
    },
    customEmoji () {
      return this.$store.state.instance.customEmoji || []
    }
  }
}

export default EmojiSelector
