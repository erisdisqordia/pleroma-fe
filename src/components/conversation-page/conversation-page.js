import Conversation from '../conversation/conversation.vue'

const conversationPage = {
  components: {
    Conversation
  },
  computed: {
    statusoid () {
      const id = this.$route.params.id
      const statuses = this.$store.state.statuses.allStatusesObject
      const status = statuses[id]

      return status
    }
  }
}

export default conversationPage
