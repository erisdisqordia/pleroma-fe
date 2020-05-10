import Checkbox from 'src/components/checkbox/checkbox.vue'

import SharedComputedObject from './helpers/shared_computed_object.js'

const FilteringTab = {
  components: {
    Checkbox
  },
  computed: {
    ...SharedComputedObject()
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
    }
  }
}

export default FilteringTab
