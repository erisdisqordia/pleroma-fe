import ProgressButton from '../progress_button/progress_button.vue'

const AccountActions = {
  props: [
    'user'
  ],
  data () {
    return {
      showDropDown: false
    }
  },
  components: {
    ProgressButton
  },
  methods: {
    showRepeats () {
      this.$store.dispatch('showReblogs', this.user.id)
    },
    hideRepeats () {
      this.$store.dispatch('hideReblogs', this.user.id)
    },
    blockUser () {
      this.$store.dispatch('blockUser', this.user.id)
    },
    unblockUser () {
      this.$store.dispatch('unblockUser', this.user.id)
    },
    reportUser () {
      this.$store.dispatch('openUserReportingModal', this.user.id)
    },
    mentionUser () {
      this.$store.dispatch('openPostStatusModal', { replyTo: true, repliedUser: this.user })
    }
  }
}

export default AccountActions
