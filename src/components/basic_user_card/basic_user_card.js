import UserCard from '../user_card/user_card.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const BasicUserCard = {
  props: [
    'user'
  ],
  data () {
    return {
      userExpanded: false
    }
  },
  components: {
    UserCard,
    UserAvatar
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    }
  }
}

export default BasicUserCard
