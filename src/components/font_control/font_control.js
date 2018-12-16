import { set } from 'vue'

export default {
  props: [
    'name', 'label', 'value', 'fallback', 'options', 'no-inherit'
  ],
  data () {
    return {
      lValue: this.value,
      availableOptions: [
        this.noInherit ? '' : 'inherit',
        'custom',
        ...(this.options || []),
        'serif',
        'monospace',
        'sans-serif'
      ].filter(_ => _)
    }
  },
  beforeUpdate () {
    this.lValue = this.value
  },
  computed: {
    present () {
      return typeof this.lValue !== 'undefined'
    },
    dValue () {
      return this.lValue || this.fallback || {}
    },
    family: {
      get () {
        return this.dValue.family
      },
      set (v) {
        set(this.lValue, 'family', v)
        this.$emit('input', this.lValue)
      }
    },
    isCustom () {
      return this.preset === 'custom'
    },
    preset: {
      get () {
        if (this.family === 'serif' ||
            this.family === 'sans-serif' ||
            this.family === 'monospace' ||
            this.family === 'inherit') {
          return this.family
        } else {
          return 'custom'
        }
      },
      set (v) {
        this.family = v === 'custom' ? '' : v
      }
    }
  }
}
