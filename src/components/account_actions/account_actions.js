import { mapState } from 'vuex'
import ProgressButton from '../progress_button/progress_button.vue'
import Popover from '../popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faEllipsisV
)

const AccountActions = {
  props: [
    'user', 'relationship'
  ],
  data () {
    return { }
  },
  components: {
    ProgressButton,
    Popover
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
    openChat () {
      this.$router.push({
        name: 'chat',
        params: { recipient_id: this.user.id }
      })
    }
  },
  computed: {
    ...mapState({
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    })
  }
}

export default AccountActions
