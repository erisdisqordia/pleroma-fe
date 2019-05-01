import UserAvatar from '../user_avatar/user_avatar.vue'

const AvatarList = {
  props: ['users'],
  computed: {
    slicedUsers () {
      return this.users ? this.users.slice(0, 15) : []
    }
  },
  components: {
    UserAvatar
  }
}

export default AvatarList
