import Vue from 'vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import UserAvatar from '../user_avatar/user_avatar.vue'

export default Vue.component('chat-title', {
  name: 'ChatTitle',
  components: {
    UserAvatar
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
  },
  methods: {
    getUserProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name)
    }
  }
})
