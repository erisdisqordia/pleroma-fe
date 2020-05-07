import Vue from 'vue'
import ChatAvatar from '../chat_avatar/chat_avatar.vue'

export default Vue.component('chat-title', {
  name: 'ChatTitle',
  components: {
    ChatAvatar
  },
  props: [
    'user', 'withAvatar'
  ],
  computed: {
    title () {
      return this.user ? this.user.screen_name : ''
    },
    htmlTitle () {
      return this.user ? this.user.name_html : ''
    }
  }
})
