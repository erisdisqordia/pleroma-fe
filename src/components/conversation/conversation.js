import { filter, sortBy } from 'lodash'
import { statusType } from '../../modules/statuses.js'
import Status from '../status/status.vue'

const sortAndFilterConversation = (conversation) => {
  conversation = filter(conversation, (status) => statusType(status) !== 'retweet')
  return sortBy(conversation, 'id')
}

const conversation = {
  data () {
    return {
      highlight: null,
      statuses: []
    }
  },
  props: [
    'statusoid',
    'collapsable'
  ],
  computed: {
    status () { return this.statusoid },
    conversation () {
      if (!this.status) {
        return false
      }

      const conversationId = this.status.statusnet_conversation_id
      const statuses = this.$store.state.statuses.allStatuses
      const conversation = filter(statuses, { statusnet_conversation_id: conversationId })
      this.statuses = sortAndFilterConversation(conversation)
      return this.statuses
    }
  },
  components: {
    Status
  },
  created () {
    this.fetchConversation()
  },
  watch: {
    '$route': 'fetchConversation'
  },
  methods: {
    fetchConversation () {
      if (this.status) {
        const conversationId = this.status.statusnet_conversation_id
        this.$store.state.api.backendInteractor.fetchConversation({id: conversationId})
          .then((statuses) => this.$store.dispatch('addNewStatuses', { statuses }))
          .then(() => this.setHighlight(this.statusoid.id))
      } else {
        const id = this.$route.params.id
        this.$store.state.api.backendInteractor.fetchStatus({id})
          .then((status) => this.$store.dispatch('addNewStatuses', { statuses: [status] }))
          .then(() => this.fetchConversation())
      }
    },
    getReplies (id) {
      let res = []
      id = Number(id)
      let i
      for (i = 0; i < this.statuses.length; i++) {
        if (Number(this.statuses[i].in_reply_to_status_id) === id) {
          res.push({
            name: `#${i}`,
            id: this.statuses[i].id
          })
        }
      }
      return res
    },
    focused (id) {
      if (this.statusoid.retweeted_status) {
        return (id === this.statusoid.retweeted_status.id)
      } else {
        return (id === this.statusoid.id)
      }
    },
    setHighlight (id) {
      this.highlight = Number(id)
    }
  }
}

export default conversation
