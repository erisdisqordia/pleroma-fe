import { library } from '@fortawesome/fontawesome-svg-core'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch
)

const UserListPopover = {
  name: 'UserListPopover',
  props: [
    'users'
  ],
  components: {
    Popover: () => import('../popover/popover.vue'),
    UserAvatar: () => import('../user_avatar/user_avatar.vue')
  },
  computed: {
    usersCapped () {
      return this.users.slice(0, 16)
    }
  }
}

export default UserListPopover
