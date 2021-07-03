import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBiohazard
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBiohazard
)

const BlockListPanel = {
  computed: {
    instanceBlocks () {
      return this.$store.state.instance.instanceBlocks
    }
  }
}

export default BlockListPanel
