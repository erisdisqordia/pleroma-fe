import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'

const Status = {
  props: [ 'statusoid' ],
  data: () => ({
    replying: false
  }),
  computed: {
    retweet () { return !!this.statusoid.retweeted_status },
    retweeter () { return this.statusoid.user.name },
    status () {
      if (this.retweet) {
        return this.statusoid.retweeted_status
      } else {
        return this.statusoid
      }
    },
    loggedIn () {
      return !!this.$store.state.users.currentUser
    },
    deleted () { return this.statusoid.deleted },
    canDelete () { return this.statusoid.user.id === this.$store.state.users.currentUser.id }
  },
  components: {
    Attachment,
    FavoriteButton,
    RetweetButton,
    PostStatusForm
  },
  methods: {
    toggleReplying () {
      this.replying = !this.replying
    },
    deleteStatus () {
      const confirmed = confirm('Do you really want to delete this status?')
      if (confirmed) {
        this.$store.dispatch('deleteStatus', { id: this.status.id })
      }
    }
  }
}

export default Status
