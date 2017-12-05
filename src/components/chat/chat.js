const chat = {
  data () {
    return {
      messages: [],
      currentMessage: '',
      socket: this.$store.state.users.socket,
      channel: null
    }
  },
  created () {
    this.channel = this.socket.channel('chat:public')
    this.channel.on('new_msg', (msg) => {
      this.messages.push(msg)
      this.messages = this.messages.slice(-19, 20)
    })
    this.channel.join()
  },
  methods: {
    submit(message) {
      this.channel.push('new_msg', {text: message}, 10000)
      this.currentMessage = '';
    }
  }
}

export default chat;
