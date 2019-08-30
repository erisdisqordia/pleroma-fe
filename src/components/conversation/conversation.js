import { reduce, filter, findIndex, clone } from 'lodash'
import Status from '../status/status.vue'

const sortById = (a, b) => {
  const idA = a.type === 'retweet' ? a.retweeted_status.id : a.id
  const idB = b.type === 'retweet' ? b.retweeted_status.id : b.id
  const seqA = Number(idA)
  const seqB = Number(idB)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA < seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return -1
  } else if (!isSeqA && isSeqB) {
    return 1
  } else {
    return idA < idB ? -1 : 1
  }
}

const sortAndFilterConversation = (conversation, statusoid) => {
  if (statusoid.type === 'retweet') {
    conversation = filter(
      conversation,
      (status) => (status.type === 'retweet' || status.id !== statusoid.retweeted_status.id)
    )
  } else {
    conversation = filter(conversation, (status) => status.type !== 'retweet')
  }
  return conversation.filter(_ => _).sort(sortById)
}

const conversation = {
  data () {
    return {
      highlight: null,
      expanded: false
    }
  },
  props: [
    'statusoid',
    'collapsable',
    'isPage',
    'pinnedStatusIdsObject'
  ],
  created () {
    if (this.isPage) {
      this.fetchConversation()
    }
  },
  computed: {
    status () {
      return this.$store.state.statuses.allStatusesObject[this.statusoid]
    },
    statusId () {
      if (this.status.retweeted_status) {
        return this.status.retweeted_status.id
      } else {
        return this.statusoid
      }
    },
    conversationId () {
      if (this.status.retweeted_status) {
        return this.status.retweeted_status.statusnet_conversation_id
      } else {
        return this.status.statusnet_conversation_id
      }
    },
    conversation () {
      if (!this.status) {
        return []
      }

      if (!this.isExpanded) {
        return [this.status]
      }

      const conversation = clone(this.$store.state.statuses.conversationsObject[this.conversationId])
      const statusIndex = findIndex(conversation, { id: this.statusId })
      if (statusIndex !== -1) {
        conversation[statusIndex] = this.status
      }

      return sortAndFilterConversation(conversation, this.status)
    },
    replies () {
      let i = 1
      // eslint-disable-next-line camelcase
      return reduce(this.conversation, (result, { id, in_reply_to_status_id }) => {
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
    },
    isExpanded () {
      return this.expanded || this.isPage
    }
  },
  components: {
    Status
  },
  watch: {
    status: 'fetchConversation',
    expanded (value) {
      if (value) {
        this.fetchConversation()
      }
    }
  },
  methods: {
    fetchConversation () {
      if (this.status) {
        this.$store.state.api.backendInteractor.fetchConversation({ id: this.statusoid })
          .then(({ ancestors, descendants }) => {
            this.$store.dispatch('addNewStatuses', { statuses: ancestors })
            this.$store.dispatch('addNewStatuses', { statuses: descendants })
            this.setHighlight(this.statusId)
          })
      } else {
        this.$store.state.api.backendInteractor.fetchStatus({ id: this.statusoid })
          .then((status) => {
            this.$store.dispatch('addNewStatuses', { statuses: [status] })
            this.fetchConversation()
          })
      }
    },
    getReplies (id) {
      return this.replies[id] || []
    },
    focused (id) {
      return (this.isExpanded) && id === this.statusoid
    },
    setHighlight (id) {
      if (!id) return
      this.highlight = id
      this.$store.dispatch('fetchFavsAndRepeats', id)
    },
    getHighlight () {
      return this.isExpanded ? this.highlight : null
    },
    toggleExpanded () {
      this.expanded = !this.expanded
    }
  }
}

export default conversation
