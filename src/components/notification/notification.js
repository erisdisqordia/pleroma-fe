import Status from '../status/status.vue'
import StillImage from '../still-image/still-image.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'

const Notification = {
  data () {
    return {
      userExpanded: false
    }
  },
  props: [
    'notification'
  ],
  components: {
    Status, StillImage, UserCardContent
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    }
  },
  computed: {
    userClass () {
      return highlightClass(this.notification.action.user)
    },
    userStyle () {
      const highlight = this.$store.state.config.highlight
      const user = this.notification.action.user
      return highlightStyle(highlight[user.screen_name])
    }
  }
}

export default Notification
