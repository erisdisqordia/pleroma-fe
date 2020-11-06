import { library } from '@fortawesome/fontawesome-svg-core'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'

library.add(faRetweet)

const RetweetButton = {
  props: ['status', 'loggedIn', 'visibility'],
  data () {
    return {
      animated: false
    }
  },
  methods: {
    retweet () {
      if (!this.status.repeated) {
        this.$store.dispatch('retweet', { id: this.status.id })
      } else {
        this.$store.dispatch('unretweet', { id: this.status.id })
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
        '-repeated': this.status.repeated
      }
    },
    mergedConfig () {
      return this.$store.getters.mergedConfig
    }
  }
}

export default RetweetButton
