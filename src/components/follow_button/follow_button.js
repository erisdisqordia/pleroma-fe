import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'
export default {
  props: ['user'],
  data () {
    return {
      inProgress: false
    }
  },
  computed: {
    isPressed () {
      return this.inProgress || this.user.following
    },
    title () {
      if (this.inProgress || this.user.following) {
        return 'user_card.follow_unfollow'
      } else if (this.user.requested) {
        return 'user_card.follow_again'
      } else {
        return ''
      }
    },
    label () {
      if (this.inProgress) {
        return 'user_card.follow_progress'
      } else if (this.user.following) {
        return 'user_card.following'
      } else if (this.user.requested) {
        return 'user_card.follow_sent'
      } else {
        return 'user_card.follow'
      }
    }
  },
  methods: {
    doClick () {
      if (this.user.following) {
        this.unfollowUser()
      } else {
        this.followUser()
      }
    },
    followUser () {
      const store = this.$store
      this.inProgress = true
      requestFollow(this.user, store).then(() => {
        this.inProgress = false
      })
    },
    unfollowUser () {
      const store = this.$store
      this.inProgress = true
      requestUnfollow(this.user, store).then(() => {
        this.inProgress = false
        store.commit('removeStatus', { timeline: 'friends', userId: this.user.id })
      })
    }
  }
}
