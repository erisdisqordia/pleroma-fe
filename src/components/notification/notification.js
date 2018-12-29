import Status from '../status/status.vue'
import StillImage from '../still-image/still-image.vue'
import UserCardContent from '../user_card_content/user_card_content.vue'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const Notification = {
  data () {
    return {
      userExpanded: false,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter
    }
  },
  props: [ 'notification' ],
  components: {
    Status, StillImage, UserCardContent
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
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
