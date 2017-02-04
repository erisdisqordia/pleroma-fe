import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
import RetweetButton from '../retweet_button/retweet_button.vue'
import DeleteButton from '../delete_button/delete_button.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'

const Status = {
  props: [
    'statusoid',
    'expandable'
  ],
  data: () => ({
    replying: false,
    expanded: false
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
    }
  },
  components: {
    Attachment,
    FavoriteButton,
    RetweetButton,
    DeleteButton,
    PostStatusForm
  },
  methods: {
    toggleReplying () {
      this.replying = !this.replying
    },
    toggleExpanded () {
      this.$emit('toggleExpanded')
    }
  }
}

export default Status
