import { rgb2hex } from '../../services/color_convert/color_convert.js'
import ColorInput from '../color_input/color_input.vue'
import OpacityInput from '../opacity_input/opacity_input.vue'
import StyleSetter from '../../services/style_setter/style_setter.js'

export default {
  data () {
    return {
      availableStyles: [],
      selected: this.$store.state.config.theme,
      invalidThemeImported: false,
      bgColorLocal: '',
      bgOpacityLocal: 0,
      btnColorLocal: '',
      btnOpacityLocal: '',

      textColorLocal: '',
      linkColorLocal: '',

      panelColorLocal: undefined,
      panelOpacityLocal: undefined,
      topBarColorLocal: undefined,
      topBarOpacityLocal: undefined,

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
    this.normalizeLocalState(this.$store.state.config.customTheme)
  },
  computed: {
    currentTheme () {
      return {
        colors: {
          bg: this.bgColorLocal,
          fg: this.textColorLocal,
          panel: this.panelColorLocal,
          topBar: this.topBarColorLocal,
          btn: this.btnColorLocal,
          link: this.linkColorLocal,
          cRed: this.redColorLocal,
          cBlue: this.blueColorLocal,
          cGreen: this.greenColorLocal,
          cOrange: this.orangeColorLocal
        },
        radii: {
          btnRadius: this.btnRadiusLocal,
          inputRadius: this.inputRadiusLocal,
          panelRadius: this.panelRadiusLocal,
          avatarRadius: this.avatarRadiusLocal,
          avatarAltRadius: this.avatarAltRadiusLocal,
          tooltipRadius: this.tooltipRadiusLocal,
          attachmentRadius: this.attachmentRadiusLocal
        }
      }
    },
    previewRules () {
      try {
        const generated = StyleSetter.generatePreset(this.currentTheme.colors)
        return [generated.colorRules, generated.radiiRules].join(';')
      } catch (e) {
        console.error('CATCH')
        console.error(e)
        return ''
      }
    }
  },
  components: {
    ColorInput,
    OpacityInput
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

      this.$store.dispatch('setOption', {
        name: 'customTheme',
        value: this.currentTheme
      })
    },

    normalizeLocalState (input) {
      const colors = input.colors || input
      const radii = input.radii || input
      let i = 0
      console.log('BENIS')
      console.log(colors)

      console.log(i++)
      this.bgColorLocal = rgb2hex(colors.bg)
      console.log(i++)
      this.btnColorLocal = rgb2hex(colors.btn)
      console.log(i++)
      this.textColorLocal = rgb2hex(colors.text || colors.fg)
      console.log(i++)
      this.linkColorLocal = rgb2hex(colors.link)
      console.log(i++)

      this.panelColorLocal = colors.panel ? rgb2hex(colors.panel) : undefined
      console.log(i++)
      this.topBarColorLocal = colors.topBad ? rgb2hex(colors.topBar) : undefined
      console.log(i++)

      this.redColorLocal = rgb2hex(colors.cRed)
      console.log(i++)
      console.log('red')
      console.log(colors.cRed)
      console.log(this.redColorLocal)
      this.blueColorLocal = rgb2hex(colors.cBlue)
      console.log(i++)
      console.log('blue', this.blueColorLocal, colors.cBlue)
      this.greenColorLocal = rgb2hex(colors.cGreen)
      console.log(i++)
      this.orangeColorLocal = rgb2hex(colors.cOrange)
      console.log(i++)

      this.btnRadiusLocal = radii.btnRadius || 4
      console.log(i++)
      this.inputRadiusLocal = radii.inputRadius || 4
      console.log(i++)
      this.panelRadiusLocal = radii.panelRadius || 10
      console.log(i++)
      this.avatarRadiusLocal = radii.avatarRadius || 5
      console.log(i++)
      this.avatarAltRadiusLocal = radii.avatarAltRadius || 50
      console.log(i++)
      this.tooltipRadiusLocal = radii.tooltipRadius || 2
      console.log(i++)
      this.attachmentRadiusLocal = radii.attachmentRadius || 5
      console.log(i++)
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
