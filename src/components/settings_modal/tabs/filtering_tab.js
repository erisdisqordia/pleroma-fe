import { filter, trim } from 'lodash'
import Checkbox from 'src/components/checkbox/checkbox.vue'

import SharedComputedObject from '../helpers/shared_computed_object.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronDown
)

const FilteringTab = {
  data () {
    return {
      muteWordsStringLocal: this.$store.getters.mergedConfig.muteWords.join('\n')
    }
  },
  components: {
    Checkbox
  },
  computed: {
    ...SharedComputedObject(),
    muteWordsString: {
      get () {
        return this.muteWordsStringLocal
      },
      set (value) {
        this.muteWordsStringLocal = value
        this.$store.dispatch('setOption', {
          name: 'muteWords',
          value: filter(value.split('\n'), (word) => trim(word).length > 0)
        })
      }
    }
  },
  // Updating nested properties
  watch: {
    notificationVisibility: {
      handler (value) {
        this.$store.dispatch('setOption', {
          name: 'notificationVisibility',
          value: this.$store.getters.mergedConfig.notificationVisibility
        })
      },
      deep: true
    },
    replyVisibility () {
      this.$store.dispatch('queueFlushAll')
    }
  }
}

export default FilteringTab
