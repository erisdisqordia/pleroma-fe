import { find } from 'lodash'

const StatusPopover = {
  name: 'StatusPopover',
  props: [
    'statusId'
  ],
  data () {
    return {
      preview: null,
      popperOptions: {
        modifiers: {
          preventOverflow: { padding: { top: 50 }, boundariesElement: 'viewport' }
        }
      }
    }
  },
  components: {
    Status: () => import('../status/status.vue')
  },
  methods: {
    enter () {
      const id = this.statusId
      const statuses = this.$store.state.statuses.allStatuses

      if (!this.preview) {
        // if we have the status somewhere already
        this.preview = find(statuses, { id })
        // or if we have to fetch it
        if (!this.preview) {
          this.$store.state.api.backendInteractor.fetchStatus({ id }).then((status) => {
            this.preview = status
            this.$nextTick(this.$refs.popper.updatePopper)
          })
        }
      } else if (this.preview.id !== id) {
        this.preview = find(statuses, 'id')
      }
    }
  }
}

export default StatusPopover
