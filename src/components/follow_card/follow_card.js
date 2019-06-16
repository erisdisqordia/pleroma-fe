import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import RemoteFollow from '../remote_follow/remote_follow.vue'
import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'

const FollowCard = {
  props: [
    'user',
    'noFollowsYou'
  ],
  data () {
    return {
      inProgress: false,
      requestSent: false
    }
  },
  components: {
    BasicUserCard,
    RemoteFollow
  },
  computed: {
    isMe () {
      return this.$store.state.users.currentUser.id === this.user.id
    },
    loggedIn () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    followUser () {
      this.inProgress = true
      requestFollow(this.user, this.$store).then(({ sent }) => {
        this.inProgress = false
        this.requestSent = sent
      })
    },
    unfollowUser () {
      this.inProgress = true
      requestUnfollow(this.user, this.$store).then(() => {
        this.inProgress = false
      })
    }
  }
}

export default FollowCard
