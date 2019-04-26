
import Status from '../status/status.vue'
import List from '../list/list.vue'
import Checkbox from '../checkbox/checkbox.vue'

const UserReportingModal = {
  components: {
    Status,
    List,
    Checkbox
  },
  data () {
    return {
      comment: '',
      forward: false,
      statusIdsToReport: [],
      processing: false,
      error: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.users.currentUser
    },
    isOpen () {
      return this.isLoggedIn && this.$store.state.reports.modalActivated
    },
    userId () {
      return this.$store.state.reports.userId
    },
    user () {
      return this.$store.getters.findUser(this.userId)
    },
    remoteInstance () {
      return !this.user.is_local && this.user.screen_name.substr(this.user.screen_name.indexOf('@') + 1)
    },
    statuses () {
      return this.$store.state.reports.statuses
    }
  },
  watch: {
    userId: 'resetState'
  },
  methods: {
    resetState () {
      // Reset state
      this.comment = ''
      this.forward = false
      this.statusIdsToReport = []
      this.processing = false
      this.error = false
    },
    closeModal () {
      this.$store.dispatch('closeUserReportingModal')
    },
    reportUser () {
      this.processing = true
      this.error = false
      const params = {
        userId: this.userId,
        comment: this.comment,
        forward: this.forward,
        statusIds: this.statusIdsToReport
      }
      this.$store.state.api.backendInteractor.reportUser(params)
        .then(() => {
          this.processing = false
          this.resetState()
          this.closeModal()
        })
        .catch(() => {
          this.processing = false
          this.error = true
        })
    },
    clearError () {
      this.error = false
    },
    isChecked (statusId) {
      return this.statusIdsToReport.indexOf(statusId) !== -1
    },
    toggleStatus (checked, statusId) {
      if (checked === this.isChecked(statusId)) {
        return
      }

      if (checked) {
        this.statusIdsToReport.push(statusId)
      } else {
        this.statusIdsToReport.splice(this.statusIdsToReport.indexOf(statusId), 1)
      }
    },
    resize (e) {
      const target = e.target || e
      if (!(target instanceof window.Element)) { return }
      // Auto is needed to make textbox shrink when removing lines
      target.style.height = 'auto'
      target.style.height = `${target.scrollHeight}px`
      if (target.value === '') {
        target.style.height = null
      }
    }
  }
}

export default UserReportingModal
