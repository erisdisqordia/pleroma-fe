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

      textColorLocal: '',
      linkColorLocal: '',

      bgColorLocal: '',
      bgOpacityLocal: undefined,

      btnColorLocal: '',
      btnTextColorLocal: undefined,
      btnOpacityLocal: undefined,

      inputColorLocal: undefined,
      inputTextColorLocal: undefined,
      inputOpacityLocal: undefined,

      panelColorLocal: undefined,
      panelTextColorLocal: undefined,
      panelOpacityLocal: undefined,

      topBarColorLocal: undefined,
      topBarTextColorLocal: undefined,
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
    selectedVersion () {
      return Array.isArray(this.selected) ? 1 : 2
    },
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
        if (!this.currentTheme.colors.bg) {
          return ''
        }
        const generated = StyleSetter.generatePreset(this.currentTheme)
        return [generated.colorRules, generated.radiiRules, 'color: var(--text)'].join(';')
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
        _pleroma_theme_version: 2,
        theme: this.currentTheme
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
                this.normalizeLocalState(parsed, 1)
              } else if (parsed._pleroma_theme_version === 2) {
                this.normalizeLocalState(parsed.theme)
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

    clearV1 () {
      this.panelColorLocal = undefined
      this.topBarColorLocal = undefined
      this.btnTextColorLocal = undefined
      this.btnOpacityLocal = undefined

      this.inputColorLocal = undefined
      this.inputTextColorLocal = undefined
      this.inputOpacityLocal = undefined

      this.panelColorLocal = undefined
      this.panelTextColorLocal = undefined
      this.panelOpacityLocal = undefined

      this.topBarColorLocal = undefined
      this.topBarTextColorLocal = undefined
      this.topBarOpacityLocal = undefined
    },

    normalizeLocalState (input, version = 2) {
      const colors = input.colors || input
      const radii = input.radii || input

      this.bgColorLocal = rgb2hex(colors.bg)
      this.btnColorLocal = rgb2hex(colors.btn)
      this.textColorLocal = rgb2hex(colors.text || colors.fg)
      this.linkColorLocal = rgb2hex(colors.link)

      if (version === 1) {
        this.clearV1()
      }

      this.panelColorLocal = rgb2hex(colors.panel)
      this.topBarColorLocal = rgb2hex(colors.topBar)

      this.redColorLocal = rgb2hex(colors.cRed)
      this.blueColorLocal = rgb2hex(colors.cBlue)
      this.greenColorLocal = rgb2hex(colors.cGreen)
      this.orangeColorLocal = rgb2hex(colors.cOrange)

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
      if (this.selectedVersion === 1) {
        this.clearV1();
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
}
