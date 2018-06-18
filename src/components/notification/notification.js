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
      return highlightClass(this.notification.action.user, this.$store)
    },
    userStyle () {
      return highlightStyle(this.notification.action.user, this.$store)
    },
  }
}

export default Notification
