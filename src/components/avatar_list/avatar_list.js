import UserAvatar from '../user_avatar/user_avatar.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const AvatarList = {
  props: ['users'],
  computed: {
    slicedUsers () {
      return this.users ? this.users.slice(0, 15) : []
    }
  },
  components: {
    UserAvatar
  },
  methods: {
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    }
  }
}

export default AvatarList
