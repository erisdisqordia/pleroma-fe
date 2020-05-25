import { requestFollow, requestUnfollow } from '../../services/follow_manipulate/follow_manipulate'
export default {
  props: ['relationship', 'labelFollowing', 'buttonClass'],
  data () {
    return {
      inProgress: false
    }
  },
  computed: {
    isPressed () {
      return this.inProgress || this.relationship.following
    },
    title () {
      if (this.inProgress || this.relationship.following) {
        return this.$t('user_card.follow_unfollow')
      } else if (this.relationship.requested) {
        return this.$t('user_card.follow_again')
      } else {
        return this.$t('user_card.follow')
      }
    },
    label () {
      if (this.inProgress) {
        return this.$t('user_card.follow_progress')
      } else if (this.relationship.following) {
        return this.labelFollowing || this.$t('user_card.following')
      } else if (this.relationship.requested) {
        return this.$t('user_card.follow_sent')
      } else {
        return this.$t('user_card.follow')
      }
    }
  },
  methods: {
    onClick () {
      this.relationship.following ? this.unfollow() : this.follow()
    },
    follow () {
      this.inProgress = true
      requestFollow(this.relationship.id, this.$store).then(() => {
        this.inProgress = false
      })
    },
    unfollow () {
      const store = this.$store
      this.inProgress = true
      requestUnfollow(this.relationship.id, store).then(() => {
        this.inProgress = false
        store.commit('removeStatus', { timeline: 'friends', userId: this.relationship.id })
      })
    }
  }
}
