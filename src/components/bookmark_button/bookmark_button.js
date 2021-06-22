import { mapGetters } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'

import {
  faBookmark as faBookmarkReg
} from '@fortawesome/free-regular-svg-icons'

library.add(faBookmark, faBookmarkReg)

const BookmarkButton = {
  props: ['status', 'loggedIn'],
  data () {
    return {
      animated: false
    }
  },
  methods: {
    bookmarkStatus () {
      if (!this.status.bookmarked) {
        this.$store.dispatch('bookmark', { id: this.status.id })
      } else {
        this.$store.dispatch('unbookmark', { id: this.status.id })
      }
      this.animated = true
      setTimeout(() => {
        this.animated = false
      }, 500)
    }
  },
  computed: {
    ...mapGetters(['mergedConfig'])
  }
}

export default BookmarkButton
