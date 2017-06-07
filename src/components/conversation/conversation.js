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
      preview: {
        x: 0,
        y: 0,
        status
      }
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
      return sortAndFilterConversation(conversation)
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
      for (i = 0; i < this.conversation.length; i++) {
        if (Number(this.conversation[i].in_reply_to_status_id) === id) {
          res.push({
            name: `#${i}`,
            id: this.conversation[i].id
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
    },
    setPreview (id, x, y) {
      if (id) {
        this.preview.x = x
        this.preview.y = y
        this.preview.status = filter(this.conversation, { id: id })[0]
        console.log(this.preview.status)
      } else {
        this.preview.status = null
      }
    }
  }
}

export default conversation
