import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'
export default {
  props: ['user', 'labelFollowing', 'buttonClass'],
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
        return this.$t('user_card.follow_unfollow')
      } else if (this.user.requested) {
        return this.$t('user_card.follow_again')
      } else {
        return this.$t('user_card.follow')
      }
    },
    label () {
      if (this.inProgress) {
        return this.$t('user_card.follow_progress')
      } else if (this.user.following) {
        return this.labelFollowing || this.$t('user_card.following')
      } else if (this.user.requested) {
        return this.$t('user_card.follow_sent')
      } else {
        return this.$t('user_card.follow')
      }
    }
  },
  methods: {
    onClick () {
      this.user.following ? this.unfollow() : this.follow()
    },
    follow () {
      this.inProgress = true
      requestFollow(this.user, this.$store).then(() => {
        this.inProgress = false
      })
    },
    unfollow () {
      const store = this.$store
      this.inProgress = true
      requestUnfollow(this.user, store).then(() => {
        this.inProgress = false
        store.commit('removeStatus', { timeline: 'friends', userId: this.user.id })
      })
    }
  }
}
