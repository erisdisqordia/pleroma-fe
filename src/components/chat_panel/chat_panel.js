import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBath,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBath,
  faTimes
)

const chatPanel = {
  props: [ 'floating' ],
  data () {
    return {
      currentMessage: '',
      channel: null,
      collapsed: true
    }
  },
  computed: {
    messages () {
      return this.$store.state.chat.messages
    },
    hideSB () {
      return this.$store.getters.mergedConfig.hideShoutbox
    },
    ...mapGetters(['mergedConfig'])
  },
  methods: {
    submit (message) {
      this.$store.state.chat.channel.push('new_msg', { text: message }, 10000)
      this.currentMessage = ''
    },
    togglePanel () {
      this.collapsed = !this.collapsed
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.username, this.$store.state.instance.restrictedNicknames)
    }
  }
}

export default chatPanel
