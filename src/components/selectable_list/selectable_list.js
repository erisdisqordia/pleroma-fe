import List from '../list/list.vue'
import Checkbox from '../checkbox/checkbox.js'

const SelectableList = {
  components: {
    List,
    Checkbox
  },
  props: List.props,
  data () {
    return {
      selected: []
    }
  },
  methods: {
    toggle (checked, key) {
      const oldChecked = this.isSelected(key)
      if (checked !== oldChecked) {
        if (checked) {
          this.selected.push(key)
        } else {
          this.selected.splice(this.selected.indexOf(key), 1)
        }
      }
    },
    isSelected (key) {
      return this.selected.indexOf(key) !== -1
    }
  }
}

export default SelectableList
