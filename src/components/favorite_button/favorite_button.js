const FavoriteButton = {
  props: [ 'status' ],
  methods: {
    favorite () {
      if (!this.status.favorited) {
        this.$store.dispatch('favorite', { id: this.status.id})
      } else {
        this.$store.dispatch('unfavorite', { id: this.status.id})
      }
    }
  },
  computed: {
    classes () {
      return {
        'icon-star-empty': !this.status.favorited,
        'icon-star': this.status.favorited
      }
    }
  }
}

export default FavoriteButton
