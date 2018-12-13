import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const chatPanel = {
  data () {
    return {
      currentMessage: '',
      channel: null,
      collapsed: true
    }
  },
  computed: {
    messages () {
      return this.$store.state.chat.messages
    },
    userProfileLink (user) {
      return generateProfileLink(user, user.name)
    }
  },
  methods: {
    submit (message) {
      this.$store.state.chat.channel.push('new_msg', {text: message}, 10000)
      this.currentMessage = ''
    },
    togglePanel () {
      this.collapsed = !this.collapsed
    }
  }
}

export default chatPanel
