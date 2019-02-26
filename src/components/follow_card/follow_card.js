import BasicUserCard from '../basic_user_card/basic_user_card.vue'
import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'

const FollowCard = {
  props: [
    'user',
    'noFollowsYou'
  ],
  data () {
    return {
      inProgress: false,
      requestSent: false,
      updated: false
    }
  },
  components: {
    BasicUserCard
  },
  computed: {
    isMe () { return this.$store.state.users.currentUser.id === this.user.id },
    following () { return this.updated ? this.updated.following : this.user.following },
    showFollow () {
      return !this.following || this.updated && !this.updated.following
    }
  },
  methods: {
    followUser () {
      this.inProgress = true
      requestFollow(this.user, this.$store).then(({ sent, updated }) => {
        this.inProgress = false
        this.requestSent = sent
        this.updated = updated
      })
    },
    unfollowUser () {
      this.inProgress = true
      requestUnfollow(this.user, this.$store).then(({ updated }) => {
        this.inProgress = false
        this.updated = updated
      })
    }
  }
}

export default FollowCard
