import Attachment from '../attachment/attachment.vue'

const Status = {
  props: [ 'statusoid' ],
  data: () => ({
    nsfw: true
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
    Attachment
  }
}

export default Status

