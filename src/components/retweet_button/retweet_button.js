const RetweetButton = {
  props: ['status', 'loggedIn', 'visibility'],
  data () {
    return {
      hidePostStatsLocal: typeof this.$store.state.config.hidePostStats === 'undefined'
        ? this.$store.state.instance.hidePostStats
        : this.$store.state.config.hidePostStats,
      animated: false
    }
  },
  methods: {
    retweet () {
      if (!this.status.repeated) {
        this.$store.dispatch('retweet', {id: this.status.id})
      } else {
        this.$store.dispatch('unretweet', {id: this.status.id})
      }
      this.animated = true
      setTimeout(() => {
        this.animated = false
      }, 500)
    }
  },
  computed: {
    classes () {
      return {
        'retweeted': this.status.repeated,
        'retweeted-empty': !this.status.repeated,
        'animate-spin': this.animated
      }
    }
  }
}

export default RetweetButton
