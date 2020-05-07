import StillImage from '../still-image/still-image.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { mapState } from 'vuex'

const ChatAvatar = {
  props: ['user', 'width', 'height'],
  components: {
    StillImage
  },
  methods: {
    getUserProfileLink (user) {
      if (!user) { return }
      return generateProfileLink(user.id, user.screen_name)
    }
  },
  computed: {
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter
    })
  }
}

export default ChatAvatar
