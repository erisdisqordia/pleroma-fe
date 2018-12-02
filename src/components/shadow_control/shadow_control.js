import ColorInput from '../color_input/color_input.vue'
import OpacityInput from '../opacity_input/opacity_input.vue'
import { getCssShadow } from '../../services/style_setter/style_setter.js'
import { hex2rgb } from '../../services/color_convert/color_convert.js'

export default {
  // 'Value' and 'Fallback' can be undefined, but if they are
  // initially vue won't detect it when they become something else
  // therefore i'm using "ready" which should be passed as true when
  // data becomes available
  props: [
    'value', 'fallback', 'ready'
  ],
  data () {
    return {
      selectedId: 0,
      // TODO there are some bugs regarding display of array (it's not getting updated when deleting for some reason)
      cValue: this.value || this.fallback || []
    }
  },
  components: {
    ColorInput,
    OpacityInput
  },
  methods: {
    add () {
      this.cValue.push(Object.assign({}, this.selected))
      this.selectedId = this.cValue.length - 1
    },
    del () {
      this.cValue.splice(this.selectedId, 1)
      this.selectedId = this.cValue.length === 0 ? undefined : this.selectedId - 1
    },
    moveUp () {
      const movable = this.cValue.splice(this.selectedId, 1)[0]
      this.cValue.splice(this.selectedId - 1, 0, movable)
      this.selectedId -= 1
    },
    moveDn () {
      const movable = this.cValue.splice(this.selectedId, 1)[0]
      this.cValue.splice(this.selectedId + 1, 0, movable)
      this.selectedId += 1
    }
  },
  beforeUpdate () {
    this.cValue = this.value || this.fallback
  },
  computed: {
    selected () {
      if (this.ready && this.cValue.length > 0) {
        return this.cValue[this.selectedId]
      } else {
        return {
          x: 0,
          y: 0,
          blur: 0,
          spread: 0,
          inset: false,
          color: '#000000',
          alpha: 1
        }
      }
    },
    moveUpValid () {
      return this.ready && this.selectedId > 0
    },
    moveDnValid () {
      return this.ready && this.selectedId < this.cValue.length - 1
    },
    present () {
      return this.ready &&
        typeof this.cValue[this.selectedId] !== 'undefined' &&
        !this.usingFallback
    },
    usingFallback () {
      return typeof this.value === 'undefined'
    },
    rgb () {
      return hex2rgb(this.selected.color)
    },
    style () {
      return this.ready ? {
        boxShadow: getCssShadow(this.cValue)
      } : {}
    }
  }
}
