import { reduce, filter } from 'lodash'
import Status from '../status/status.vue'

const sortById = (a, b) => {
  const seqA = Number(a.id)
  const seqB = Number(b.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA < seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return 1
  } else if (!isSeqA && isSeqB) {
    return -1
  } else {
    return a.id < b.id ? -1 : 1
  }
}

const sortAndFilterConversation = (conversation) => {
  conversation = filter(conversation, (status) => status.type !== 'retweet')
  return conversation.filter(_ => _).sort(sortById)
}

const conversation = {
  data () {
    return {
      highlight: null
    }
  },
  props: [
    'statusoid',
    'collapsable'
  ],
  computed: {
    status () {
      return this.statusoid
    },
    conversation () {
      if (!this.status) {
        return []
      }

      const conversationId = this.status.statusnet_conversation_id
      const statuses = this.$store.state.statuses.allStatuses
      const conversation = filter(statuses, { statusnet_conversation_id: conversationId })
      return sortAndFilterConversation(conversation)
    },
    replies () {
      let i = 1
      return reduce(this.conversation, (result, {id, in_reply_to_status_id}) => {
        /* eslint-disable camelcase */
        const irid = in_reply_to_status_id
        /* eslint-enable camelcase */
        if (irid) {
          result[irid] = result[irid] || []
          result[irid].push({
            name: `#${i}`,
            id: id
          })
        }
        i++
        return result
      }, {})
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
      return this.replies[id] || []
    },
    focused (id) {
      if (this.statusoid.retweeted_status) {
        return (id === this.statusoid.retweeted_status.id)
      } else {
        return (id === this.statusoid.id)
      }
    },
    setHighlight (id) {
      this.highlight = id
    }
  }
}

export default conversation
