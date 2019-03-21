import { reduce, filter } from 'lodash'
import { set } from 'vue'
import Status from '../status/status.vue'

const sortById = (a, b) => {
  const seqA = Number(a.id)
  const seqB = Number(b.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA < seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return -1
  } else if (!isSeqA && isSeqB) {
    return 1
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
      highlight: null,
      relevantIds: []
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
    idsToShow () {
      if (this.relevantIds.length > 0) {
        return this.relevantIds
      } else if (this.statusId) {
        return [this.statusId]
      } else {
        return []
      }
    },
    statusId () {
      if (this.statusoid.retweeted_status) {
        return this.statusoid.retweeted_status.id
      } else {
        return this.statusoid.id
      }
    },
    conversation () {
      if (!this.status) {
        return []
      }

      const statusesObject = this.$store.state.statuses.allStatusesObject
      const conversation = this.idsToShow.reduce((acc, id) => {
        acc.push(statusesObject[id])
        return acc
      }, [])
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
        const conversationId = this.status.id
        this.$store.state.api.backendInteractor.fetchConversation({id: conversationId})
          .then(({ancestors, descendants}) => {
            this.$store.dispatch('addNewStatuses', { statuses: ancestors })
            this.$store.dispatch('addNewStatuses', { statuses: descendants })
            set(this, 'relevantIds', [].concat(
              ancestors.map(_ => _.id),
              this.statusId,
              descendants.map(_ => _.id)))
          })
          .then(() => this.setHighlight(this.statusId))
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
      return id === this.statusId
    },
    setHighlight (id) {
      this.highlight = id
    }
  }
}

export default conversation
