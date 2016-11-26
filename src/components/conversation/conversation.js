import { find, filter, sortBy, toInteger } from 'lodash'
import Status from '../status/status.vue'
import apiService from '../../services/api/api.service.js'

const conversation = {
  computed: {
    status () {
      const id = toInteger(this.$route.params.id)
      const statuses = this.$store.state.statuses.allStatuses
      const status = find(statuses, {id})

      return status
    },
    conversation () {
      if (!this.status) {
        return false
      }

      const conversationId = this.status.statusnet_conversation_id
      const statuses = this.$store.state.statuses.allStatuses
      const conversation = filter(statuses, { statusnet_conversation_id: conversationId })
      return sortBy(conversation, 'id')
    }
  },
  components: {
    Status
  },
  created () {
    this.fetchConversation()
  },
  methods: {
    fetchConversation () {
      if (this.status) {
        const conversationId = this.status.statusnet_conversation_id
        apiService.fetchConversation({id: conversationId})
          .then((statuses) => this.$store.dispatch('addNewStatuses', { statuses }))
          .then(() => this.$store.commit('updateTimestamps'))
      } else {
        const id = this.$route.params.id
        apiService.fetchStatus({id})
          .then((status) => this.$store.dispatch('addNewStatuses', { statuses: [status] }))
          .then(() => this.fetchConversation())
      }
    }
  }
}

export default conversation
