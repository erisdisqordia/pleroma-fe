import statusPoster from '../../services/status_poster/status_poster.service.js'

const PostStatusForm = {
  props: [
    'replyTo'
  ],
  data () {
    return {
      newStatus: { }
    }
  },
  methods: {
    postStatus (newStatus) {
      statusPoster.postStatus({
        status: newStatus.status,
        store: this.$store,
        inReplyToStatusId: this.replyTo
      })
      this.newStatus = { }
    }
  }
}

export default PostStatusForm
