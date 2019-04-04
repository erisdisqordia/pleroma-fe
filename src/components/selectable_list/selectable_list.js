import List from '../list/list.vue'
import Checkbox from '../checkbox/checkbox.js'

const SelectableList = {
  components: {
    List,
    Checkbox
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    getKey: {
      type: Function,
      default: item => item
    }
  },
  data () {
    return {
      selected: []
    }
  },
  methods: {
    toggle (checked, item) {
      const oldChecked = this.isSelected(item)
      if (checked !== oldChecked) {
        const key = this.getKey(item)
        if (checked) {
          this.selected.push(key)
        } else {
          this.selected.splice(this.selected.indexOf(key), 1)
        }
      }
    },
    isSelected (item) {
      return this.selected.indexOf(this.getKey(item)) !== -1
    }
  }
}

export default SelectableList
