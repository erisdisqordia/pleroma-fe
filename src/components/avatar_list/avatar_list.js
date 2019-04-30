import UserAvatar from '../user_avatar/user_avatar.vue'

const AvatarList = {
  props: ['avatars'],
  computed: {
    slicedAvatars () {
      return this.avatars ? this.avatars.slice(0, 15) : []
    }
  },
  components: {
    UserAvatar
  }
}

export default AvatarList
