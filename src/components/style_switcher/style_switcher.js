import { rgbstr2hex } from '../../services/color_convert/color_convert.js'

export default {
  data () {
    return {
      availableStyles: [],
      selected: this.$store.state.config.theme,
      invalidThemeImported: false,
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
    this.normalizeLocalState(this.$store.state.config.colors, this.$store.state.config.radii)
  },
  methods: {
    exportCurrentTheme () {
      const stringified = JSON.stringify({
        // To separate from other random JSON files and possible future theme formats
        _pleroma_theme_version: 1,
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

    importTheme () {
      this.invalidThemeImported = false
      const filePicker = document.createElement('input')
      filePicker.setAttribute('type', 'file')
      filePicker.setAttribute('accept', '.json')

      filePicker.addEventListener('change', event => {
        if (event.target.files[0]) {
          // eslint-disable-next-line no-undef
          const reader = new FileReader()
          reader.onload = ({target}) => {
            try {
              const parsed = JSON.parse(target.result)
              if (parsed._pleroma_theme_version === 1) {
                this.normalizeLocalState(parsed.colors, parsed.radii)
              } else {
                // A theme from the future, spooky
                this.invalidThemeImported = true
              }
            } catch (e) {
              // This will happen both if there is a JSON syntax error or the theme is missing components
              this.invalidThemeImported = true
            }
          }
          reader.readAsText(event.target.files[0])
        }
      })

      document.body.appendChild(filePicker)
      filePicker.click()
      document.body.removeChild(filePicker)
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
    },

    normalizeLocalState (colors, radii) {
      this.bgColorLocal = rgbstr2hex(colors.bg)
      this.btnColorLocal = rgbstr2hex(colors.btn)
      this.textColorLocal = rgbstr2hex(colors.fg)
      this.linkColorLocal = rgbstr2hex(colors.link)

      this.redColorLocal = rgbstr2hex(colors.cRed)
      this.blueColorLocal = rgbstr2hex(colors.cBlue)
      this.greenColorLocal = rgbstr2hex(colors.cGreen)
      this.orangeColorLocal = rgbstr2hex(colors.cOrange)

      this.btnRadiusLocal = radii.btnRadius || 4
      this.inputRadiusLocal = radii.inputRadius || 4
      this.panelRadiusLocal = radii.panelRadius || 10
      this.avatarRadiusLocal = radii.avatarRadius || 5
      this.avatarAltRadiusLocal = radii.avatarAltRadius || 50
      this.tooltipRadiusLocal = radii.tooltipRadius || 2
      this.attachmentRadiusLocal = radii.attachmentRadius || 5
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
