const RetweetButton = {
  props: [ 'status' ],
  methods: {
    retweet () {
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
