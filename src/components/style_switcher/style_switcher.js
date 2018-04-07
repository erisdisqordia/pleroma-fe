import { rgbstr2hex } from '../../services/color_convert/color_convert.js'

export default {
  data () {
    return {
      availableStyles: [],
      selected: this.$store.state.config.theme,
      bgColorLocal: '',
      btnColorLocal: '',
      textColorLocal: '',
      linkColorLocal: '',
      redColorLocal: '#ff0000',
      blueColorLocal: '#0095ff',
      greenColorLocal: '#0fa00f',
      orangeColorLocal: '#E3FF00'
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
    this.btnColorLocal = rgbstr2hex(this.$store.state.config.colors.lightBg)
    this.textColorLocal = rgbstr2hex(this.$store.state.config.colors.fg)
    this.linkColorLocal = rgbstr2hex(this.$store.state.config.colors.link)

    this.redColorLocal = rgbstr2hex(this.$store.state.config.colors.cRed || this.redColorLocal)
    this.blueColorLocal = rgbstr2hex(this.$store.state.config.colors.cBlue || this.blueColorLocal)
    this.greenColorLocal = rgbstr2hex(this.$store.state.config.colors.cGreen || this.greenColorLocal)
    this.orangeColorLocal = rgbstr2hex(this.$store.state.config.colors.cOrange || this.orangeColorLocal)
  },
  methods: {
    setCustomTheme () {
      if (!this.bgColorLocal && !this.btnColorLocal && !this.linkColorLocal) {
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
      const btnRgb = rgb(this.btnColorLocal)
      const textRgb = rgb(this.textColorLocal)
      const linkRgb = rgb(this.linkColorLocal)

      const redRgb = rgb(this.redColorLocal)
      const blueRgb = rgb(this.blueColorLocal)
      const greenRgb = rgb(this.greenColorLocal)
      const orangeRgb = rgb(this.orangeColorLocal)

      if (bgRgb && btnRgb && linkRgb) {
        this.$store.dispatch('setOption', {
          name: 'customTheme',
          value: {
            fg: btnRgb,
            bg: bgRgb,
            text: textRgb,
            link: linkRgb,
            cRed: redRgb,
            cBlue: blueRgb,
            cGreen: greenRgb,
            cOrange: orangeRgb
          }})
      }
    }
  },
  watch: {
    selected () {
      this.bgColorLocal = this.selected[1]
      this.btnColorLocal = this.selected[2]
      this.textColorLocal = this.selected[3]
      this.linkColorLocal = this.selected[4]
      this.redColorLocal = this.selected[5]
      this.greenColorLocal = this.selected[6]
      this.blueColorLocal = this.selected[7]
      this.orangeColorLocal = this.selected[8]
    }
  }
}
