import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { library } from '@fortawesome/fontawesome-svg-core'
import EmojiInput from 'src/components/emoji_input/emoji_input.vue'
import suggestor from '../emoji_input/suggestor.js'
import {
  faCat,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCat,
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
  components: { EmojiInput },
  computed: {
    emojiUserSuggestor () {
      return suggestor({
        emoji: [
          ...this.$store.state.instance.emoji,
        ],
        store: this.$store
      })
    },
    emojiSuggestor () {
      return suggestor({ emoji: [
        ...this.$store.state.instance.emoji,
      ] })
    },
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
  }
}

export default chatPanel
