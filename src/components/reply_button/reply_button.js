
const ReplyButton = {
  name: 'ReplyButton',
  props: ['status', 'replying'],
  computed: {
    loggedIn () {
      return !!this.$store.state.users.currentUser
    }
  }
}

export default ReplyButton
