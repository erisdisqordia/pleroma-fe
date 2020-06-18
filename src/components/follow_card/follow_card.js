import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import RemoteFollow from '../remote_follow/remote_follow.vue'
import FollowButton from '../follow_button/follow_button.vue'

const FollowCard = {
  props: [
    'user',
    'noFollowsYou'
  ],
  components: {
    BasicUserCard,
    RemoteFollow,
    FollowButton
  },
  computed: {
    isMe () {
      return this.$store.state.users.currentUser.id === this.user.id
    },
    loggedIn () {
      return this.$store.state.users.currentUser
    },
    relationship () {
      return this.$store.getters.relationship(this.user.id)
    }
  }
}

export default FollowCard
