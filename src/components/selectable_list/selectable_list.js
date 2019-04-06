import List from '../list/list.vue'
import Checkbox from '../checkbox/checkbox.vue'

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
      default: item => item.id
    }
  },
  data () {
    return {
      selected: []
    }
  },
  computed: {
    allSelected () {
      return !this.items.find(item => !this.isSelected(item))
    }
  },
  methods: {
    isSelected (item) {
      return this.selected.indexOf(this.getKey(item)) !== -1
    },
    toggle (checked, item) {
      const key = this.getKey(item)
      const oldChecked = this.isSelected(key)
      if (checked !== oldChecked) {
        if (checked) {
          this.selected.push(key)
        } else {
          this.selected.splice(this.selected.indexOf(key), 1)
        }
      }
    },
    toggleAll (value) {
      if (value) {
        this.selected = this.items.map(this.getKey)
      } else {
        this.selected = []
      }
    }
  }
}

export default SelectableList
