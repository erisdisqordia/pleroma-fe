import UserCardContent from '../user_card_content/user_card_content.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'

const UserCard = {
  props: [
    'user',
    'noFollowsYou',
    'showApproval'
  ],
  data () {
    return {
      userExpanded: false,
      followRequestInProgress: false,
      followRequestSent: false,
      updated: false
    }
  },
  components: {
    UserCardContent,
    UserAvatar
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    following () { return this.updated ? this.updated.following : this.user.following },
    showFollow () {
      return !this.showApproval && (!this.following || this.updated && !this.updated.following)
    }
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    approveUser () {
      this.$store.state.api.backendInteractor.approveUser(this.user.id)
      this.$store.dispatch('removeFollowRequest', this.user)
    },
    denyUser () {
      this.$store.state.api.backendInteractor.denyUser(this.user.id)
      this.$store.dispatch('removeFollowRequest', this.user)
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    followUser () {
      this.followRequestInProgress = true
      requestFollow(this.user, this.$store).then(({ sent, updated }) => {
        this.followRequestInProgress = false
        this.followRequestSent = sent
        this.updated = updated
      })
    },
    unfollowUser () {
      this.followRequestInProgress = true
      requestUnfollow(this.user, this.$store).then(({ updated }) => {
        this.followRequestInProgress = false
        this.updated = updated
      })
    }
  }
}

export default UserCard
