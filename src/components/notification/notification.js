import Status from '../status/status.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import UserCard from '../user_card/user_card.vue'
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
    Status, UserAvatar, UserCard
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    getUser (notification) {
      return this.$store.state.users.usersObject[notification.action.user.id]
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
    },
    userInStore () {
      return this.$store.getters.findUser(this.notification.action.user.id)
    },
    user () {
      if (this.userInStore) {
        return this.userInStore
      }
      return {}
    }
  }
}

export default Notification
