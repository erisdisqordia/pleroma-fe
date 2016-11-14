const RetweetButton = {
  props: [ 'status' ],
  methods: {
    retweet () {
      if (!this.status.repeated) {
        this.$store.dispatch('retweet', {id: this.status.id})
      }
    }
  },
  computed: {
    classes () {
      return {
        'retweeted': this.status.repeated
      }
    }
  }
}

export default RetweetButton
