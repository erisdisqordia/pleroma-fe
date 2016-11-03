import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'
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
    }
  },
  components: {
    Attachment,
    FavoriteButton,
    PostStatusForm
  },
  methods: {
    toggleReplying () {
      this.replying = !this.replying
    }
  }
}

export default Status
