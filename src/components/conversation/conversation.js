import { reduce, filter, findIndex } from 'lodash'
import { set } from 'vue'
import Status from '../status/status.vue'

const sortById = (a, b) => {
  const idA = a.type === 'retweet' ? a.retweeted_status.id : a.id
  const idB = b.type === 'retweet' ? b.retweeted_status.id : b.id
  return idA < idB ? -1 : 1
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
      expanded: false,
      converationStatusIds: []
    }
  },
  props: [
    'statusoid',
    'collapsable',
    'isPage'
  ],
  created () {
    if (this.isPage) {
      this.fetchConversation()
    }
  },
  computed: {
    status () {
      return this.statusoid
    },
    idsToShow () {
      if (this.converationStatusIds.length > 0) {
        return this.converationStatusIds
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

      if (!this.isExpanded) {
        return [this.status]
      }

      const statusesObject = this.$store.state.statuses.allStatusesObject
      const conversation = this.idsToShow.reduce((acc, id) => {
        acc.push(statusesObject[id])
        return acc
      }, [])

      const statusIndex = findIndex(conversation, { id: this.statusId })
      if (statusIndex !== -1) {
        conversation[statusIndex] = this.status
      }

      return sortAndFilterConversation(conversation, this.status)
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
    },
    isExpanded () {
      return this.expanded || this.isPage
    }
  },
  components: {
    Status
  },
  watch: {
    '$route': 'fetchConversation',
    expanded (value) {
      if (value) {
        this.fetchConversation()
      }
    }
  },
  methods: {
    fetchConversation () {
      if (this.status) {
        this.$store.state.api.backendInteractor.fetchConversation({id: this.status.id})
          .then(({ancestors, descendants}) => {
            this.$store.dispatch('addNewStatuses', { statuses: ancestors })
            this.$store.dispatch('addNewStatuses', { statuses: descendants })
            set(this, 'converationStatusIds', [].concat(
              ancestors.map(_ => _.id).filter(_ => _ !== this.statusId),
              this.statusId,
              descendants.map(_ => _.id).filter(_ => _ !== this.statusId)))
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
      return (this.isExpanded) && id === this.status.id
    },
    setHighlight (id) {
      this.highlight = id
    },
    getHighlight () {
      return this.isExpanded ? this.highlight : null
    },
    toggleExpanded () {
      this.expanded = !this.expanded
      if (!this.expanded) {
        this.setHighlight(null)
      }
    }
  }
}

export default conversation
