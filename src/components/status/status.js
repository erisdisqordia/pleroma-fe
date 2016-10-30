import Attachment from '../attachment/attachment.vue'
import FavoriteButton from '../favorite_button/favorite_button.vue'

const Status = {
  props: [ 'statusoid' ],
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
    FavoriteButton
  }
}

export default Status
