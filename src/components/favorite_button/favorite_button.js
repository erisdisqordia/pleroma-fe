import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import {
  faStar as faStarRegular
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faStar,
  faStarRegular
)

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
        '-favorited': this.status.favorited
      }
    },
    ...mapGetters(['mergedConfig'])
  }
}

export default FavoriteButton
