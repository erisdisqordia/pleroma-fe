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
    allKeys () {
      return this.items.map(this.getKey)
    },
    filteredSelected () {
      return this.allKeys.filter(key => this.selected.indexOf(key) !== -1)
    },
    allSelected () {
      return this.filteredSelected.length === this.items.length
    },
    noneSelected () {
      return this.filteredSelected.length === 0
    },
    someSelected () {
      return !this.allSelected && !this.noneSelected
    }
  },
  methods: {
    isSelected (item) {
      return this.filteredSelected.indexOf(this.getKey(item)) !== -1
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
        this.selected = this.allKeys.slice(0)
      } else {
        this.selected = []
      }
    }
  }
}

export default SelectableList
