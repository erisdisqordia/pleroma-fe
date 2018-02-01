const chatPanel = {
  data () {
    return {
      currentMessage: '',
      channel: null
    }
  },
  computed: {
    messages () {
      return this.$store.state.chat.messages
    }
  },
  methods: {
    submit (message) {
      this.$store.state.chat.channel.push('new_msg', {text: message}, 10000)
      this.currentMessage = ''
    }
  }
}

export default chatPanel
