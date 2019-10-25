import { find } from 'lodash'

const StatusPopover = {
  name: 'StatusPopover',
  props: [
    'statusId'
  ],
  data () {
    return {
      popperOptions: {
        modifiers: {
          preventOverflow: { padding: { top: 50 }, boundariesElement: 'viewport' }
        }
      }
    }
  },
  computed: {
    status () {
      return find(this.$store.state.statuses.allStatuses, { id: this.statusId })
    }
  },
  components: {
    Status: () => import('../status/status.vue')
  },
  methods: {
    enter () {
      if (!this.status) {
        this.$store.state.api.backendInteractor.fetchStatus({ id: this.statusId })
          .then((status) => {
            this.$store.dispatch('addNewStatuses', { statuses: [status] })
          })
      }
    }
  }
}

export default StatusPopover
