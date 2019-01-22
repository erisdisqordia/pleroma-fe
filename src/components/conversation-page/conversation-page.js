import Conversation from '../conversation/conversation.vue'
import { find } from 'lodash'

const conversationPage = {
  components: {
    Conversation
  },
  computed: {
    statusoid () {
      const id = this.$route.params.id
      const statuses = this.$store.state.statuses.allStatuses
      const status = find(statuses, {id})

      return status
    }
  }
}

export default conversationPage
