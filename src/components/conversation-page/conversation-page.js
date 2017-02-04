import Conversation from '../conversation/conversation.vue'
import { find, toInteger } from 'lodash'

const conversationPage = {
  components: {
    Conversation
  },
  computed: {
    statusoid () {
      const id = toInteger(this.$route.params.id)
      const statuses = this.$store.state.statuses.allStatuses
      const status = find(statuses, {id})

      return status
    }
  }
}

export default conversationPage
