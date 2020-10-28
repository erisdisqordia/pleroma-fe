import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes
)

const GlobalNoticeList = {
  computed: {
    notices () {
      return this.$store.state.interface.globalNotices
    }
  },
  methods: {
    closeNotice (notice) {
      this.$store.dispatch('removeGlobalNotice', notice)
    }
  }
}

export default GlobalNoticeList
