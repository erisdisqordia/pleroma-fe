import { find } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch
)

const StatusPopover = {
  name: 'StatusPopover',
  props: [
    'statusId'
  ],
  data () {
    return {
      error: false
    }
  },
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
        if (!this.statusId) {
          this.error = true
          return
        }
        this.$store.dispatch('fetchStatus', this.statusId)
          .then(data => (this.error = false))
          .catch(e => (this.error = true))
      }
    }
  }
}

export default StatusPopover
