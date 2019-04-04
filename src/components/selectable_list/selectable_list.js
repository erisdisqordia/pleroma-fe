import Checkbox from '../checkbox/checkbox.js'

const SelectableList = {
  components: {
    Checkbox
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
}

export default SelectableList
