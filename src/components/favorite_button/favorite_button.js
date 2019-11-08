import { mapGetters } from 'vuex'

const FavoriteButton = {
  props: ['status', 'loggedIn'],
  data () {
    return {
      animated: false
    }
  },
  methods: {
    favorite () {
      if (!this.status.favorited) {
        this.$store.dispatch('favorite', { id: this.status.id })
      } else {
        this.$store.dispatch('unfavorite', { id: this.status.id })
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
        'icon-star-empty': !this.status.favorited,
        'icon-star': this.status.favorited,
        'animate-spin': this.animated
      }
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default FavoriteButton
