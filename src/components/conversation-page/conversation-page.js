import Conversation from '../conversation/conversation.vue'

const conversationPage = {
  components: {
    Conversation
  },
  computed: {
    statusId () {
      return this.$route.params.id
    }
  }
}

export default conversationPage
