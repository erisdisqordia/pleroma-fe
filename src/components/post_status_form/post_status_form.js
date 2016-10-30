import statusPoster from '../../services/status_poster/status_poster.service.js'

const PostStatusForm = {
  data() {
    return {
      newStatus: { }
    }
  },
  methods: {
    postStatus(newStatus) {
      statusPoster.postStatus({
        status: newStatus.status,
        store: this.$store
      })
      this.newStatus = { }
    }
  }
}

export default PostStatusForm
