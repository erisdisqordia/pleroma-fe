
const UserListPopover = {
  name: 'UserListPopover',
  props: [
    'users'
  ],
  components: {
    Popover: () => import('../popover/popover.vue'),
    UserAvatar: () => import('../user_avatar/user_avatar.vue')
  }
}

export default UserListPopover
