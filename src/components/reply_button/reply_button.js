import { library } from '@fortawesome/fontawesome-svg-core'
import { faReply } from '@fortawesome/free-solid-svg-icons'

library.add(faReply)

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
