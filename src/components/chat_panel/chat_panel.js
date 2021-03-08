import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBullhorn,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBullhorn,
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
    }
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
  },
  watch: {
    messages (newVal) {
      const scrollEl = this.$el.querySelector('.chat-window')
      if (!scrollEl) return
      if (scrollEl.scrollTop + scrollEl.offsetHeight + 20 > scrollEl.scrollHeight) {
        this.$nextTick(() => {
          if (!scrollEl) return
          scrollEl.scrollTop = scrollEl.scrollHeight - scrollEl.offsetHeight
        })
      }
    }
  }
}

export default chatPanel
