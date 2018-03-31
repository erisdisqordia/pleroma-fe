import { rgbstr2hex } from '../../services/color_convert/color_convert.js'

export default {
  data () {
    return {
      availableStyles: [],
      selected: this.$store.state.config.theme,
      bgColorLocal: '',
      fgColorLocal: '',
      textColorLocal: '',
      linkColorLocal: ''
    }
  },
  created () {
    const self = this

    window.fetch('/static/styles.json')
      .then((data) => data.json())
      .then((themes) => {
        self.availableStyles = themes
      })
  },
  mounted () {
    this.bgColorLocal = rgbstr2hex(this.$store.state.config.colors.bg)
    this.fgColorLocal = rgbstr2hex(this.$store.state.config.colors.lightBg)
    this.textColorLocal = rgbstr2hex(this.$store.state.config.colors.fg)
    this.linkColorLocal = rgbstr2hex(this.$store.state.config.colors.link)
  },
  methods: {
    setCustomTheme () {
      if (!this.bgColorLocal && !this.fgColorLocal && !this.linkColorLocal) {
        // reset to picked themes
      }
      const rgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }
      const bgRgb = rgb(this.bgColorLocal)
      const fgRgb = rgb(this.fgColorLocal)
      const textRgb = rgb(this.textColorLocal)
      const linkRgb = rgb(this.linkColorLocal)
      if (bgRgb && fgRgb && linkRgb) {
        this.$store.dispatch('setOption', {
          name: 'customTheme',
          value: {
            fg: fgRgb,
            bg: bgRgb,
            text: textRgb,
            link: linkRgb
          }})
      }
    }
  },
  watch: {
    selected () {
      this.bgColorLocal = this.selected[1]
      this.fgColorLocal = this.selected[2]
      this.textColorLocal = this.selected[3]
      this.linkColorLocal = this.selected[4]
    }
  }
}
