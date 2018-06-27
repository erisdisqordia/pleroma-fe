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
      redColorLocal: '',
      blueColorLocal: '',
      greenColorLocal: '',
      orangeColorLocal: '',
      btnRadiusLocal: '',
      inputRadiusLocal: '',
      panelRadiusLocal: '',
      avatarRadiusLocal: '',
      avatarAltRadiusLocal: '',
      attachmentRadiusLocal: '',
      tooltipRadiusLocal: ''
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
    this.btnColorLocal = rgbstr2hex(this.$store.state.config.colors.btn)
    this.textColorLocal = rgbstr2hex(this.$store.state.config.colors.fg)
    this.linkColorLocal = rgbstr2hex(this.$store.state.config.colors.link)

    this.redColorLocal = rgbstr2hex(this.$store.state.config.colors.cRed)
    this.blueColorLocal = rgbstr2hex(this.$store.state.config.colors.cBlue)
    this.greenColorLocal = rgbstr2hex(this.$store.state.config.colors.cGreen)
    this.orangeColorLocal = rgbstr2hex(this.$store.state.config.colors.cOrange)

    this.btnRadiusLocal = this.$store.state.config.radii.btnRadius || 4
    this.inputRadiusLocal = this.$store.state.config.radii.inputRadius || 4
    this.panelRadiusLocal = this.$store.state.config.radii.panelRadius || 10
    this.avatarRadiusLocal = this.$store.state.config.radii.avatarRadius || 5
    this.avatarAltRadiusLocal = this.$store.state.config.radii.avatarAltRadius || 50
    this.tooltipRadiusLocal = this.$store.state.config.radii.tooltipRadius || 2
    this.attachmentRadiusLocal = this.$store.state.config.radii.attachmentRadius || 5
  },
  methods: {
    exportCurrentTheme () {
      const stringified = JSON.stringify({
        colors: this.$store.state.config.colors,
        radii: this.$store.state.config.radii
      }, null, 2) // Pretty-print and indent with 2 spaces

      // Create an invisible link with a data url and simulate a click
      const e = document.createElement('a')
      e.setAttribute('download', 'pleroma_theme.json')
      e.setAttribute('href', 'data:application/json;base64,' + window.btoa(stringified))
      e.style.display = 'none'

      document.body.appendChild(e)
      e.click()
      document.body.removeChild(e)
    },

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
            cOrange: orangeRgb,
            btnRadius: this.btnRadiusLocal,
            inputRadius: this.inputRadiusLocal,
            panelRadius: this.panelRadiusLocal,
            avatarRadius: this.avatarRadiusLocal,
            avatarAltRadius: this.avatarAltRadiusLocal,
            tooltipRadius: this.tooltipRadiusLocal,
            attachmentRadius: this.attachmentRadiusLocal
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
