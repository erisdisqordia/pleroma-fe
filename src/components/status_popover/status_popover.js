import { find } from 'lodash'

const StatusPopover = {
  name: 'StatusPopover',
  props: [
    'statusId'
  ],
  computed: {
    status () {
      return find(this.$store.state.statuses.allStatuses, { id: this.statusId })
    }
  },
  components: {
    Status: () => import('../status/status.vue'),
    Popover: () => import('../popover/popover.vue')
  },
  methods: {
    enter () {
      if (!this.status) {
        this.$store.dispatch('fetchStatus', this.statusId)
      }
    }
  }
}

export default StatusPopover
