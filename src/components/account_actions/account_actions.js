import FollowButton from '../follow_button/follow_button.vue'
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
    FollowButton,
    ProgressButton
  },
  computed: {
    tagsSet () {
      return new Set(this.user.tags)
    },
    hasTagPolicy () {
      return this.$store.state.instance.tagPolicyAvailable
    }
  },
  methods: {
    subscribeUser () {
      return this.$store.dispatch('subscribeUser', this.user.id)
    },
    unsubscribeUser () {
      return this.$store.dispatch('unsubscribeUser', this.user.id)
    },
    showRepeats () {
      this.$store.dispatch('showReblogs', this.user.id)
    },
    hideRepeats () {
      this.$store.dispatch('hideReblogs', this.user.id)
    },
    muteUser () {
      this.$store.dispatch('muteUser', this.user.id)
    },
    unmuteUser () {
      this.$store.dispatch('unmuteUser', this.user.id)
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
