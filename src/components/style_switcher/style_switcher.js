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

      fgColorLocal: '',
      fgOpacityLocal: undefined,
      fgTextColorLocal: undefined,
      fgLinkColorLocal: undefined,

      btnColorLocal: undefined,
      btnTextColorLocal: undefined,
      btnOpacityLocal: undefined,

      inputColorLocal: undefined,
      inputTextColorLocal: undefined,
      inputOpacityLocal: undefined,

      panelColorLocal: undefined,
      panelTextColorLocal: undefined,
      panelFaintColorLocal: undefined,
      panelOpacityLocal: undefined,

      topBarColorLocal: undefined,
      topBarTextColorLocal: undefined,
      topBarLinkColorLocal: undefined,
      topBarOpacityLocal: undefined,

      alertOpacityLocal: undefined,

      borderColorLocal: undefined,
      borderOpacityLocal: undefined,

      faintColorLocal: undefined,
      faintOpacityLocal: undefined,
      faintLinkColorLocal: undefined,

      cRedColorLocal: '',
      cBlueColorLocal: '',
      cGreenColorLocal: '',
      cOrangeColorLocal: '',

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
          text: this.textColorLocal,
          link: this.linkColorLocal,

          fg: this.fgColorLocal,
          fgText: this.fgTextColorLocal,
          fgLink: this.fgLinkColorLocal,

          panel: this.panelColorLocal,
          panelText: this.panelTextColorLocal,
          panelFaint: this.panelFaintColorLocal,

          input: this.inputColorLocal,
          inputText: this.inputTextColorLocal,

          topBar: this.topBarColorLocal,
          topBarText: this.topBarTextColorLocal,
          topBarLink: this.topBarLinkColorLocal,

          btn: this.btnColorLocal,
          btnText: this.btnTextColorLocal,

          faint: this.faintColorLocal,
          faintLink: this.faintLinkColorLocal,
          border: this.borderColorLocal,

          cRed: this.cRedColorLocal,
          cBlue: this.cBlueColorLocal,
          cGreen: this.cGreenColorLocal,
          cOrange: this.cOrangeColorLocal
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
    preview () {
      try {
        if (!this.currentTheme.colors.bg) {
          return {}
        }
        return StyleSetter.generatePreset(this.currentTheme)
      } catch (e) {
        console.error('CATCH')
        console.error(e)
        return {}
      }
    },
    previewTheme () {
      if (!this.preview.theme) return { colors: {}, radii: {} }
      console.log(this.preview.theme)
      return this.preview.theme
    },
    previewRules () {
      if (!this.preview.colorRules) return ''
      return [this.preview.colorRules, this.preview.radiiRules, 'color: var(--text)'].join(';')
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
                this.normalizeLocalState(parsed.theme, 2)
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
      this.bgOpacityLocal = undefined
      this.fgOpacityLocal = undefined
      this.fgTextColorLocal = undefined
      this.fgLinkColorLocal = undefined

      this.btnColorLocal = undefined
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
      this.topBarLinkColorLocal = undefined
      this.topBarOpacityLocal = undefined

      this.alertOpacityLocal = undefined

      this.borderColorLocal = undefined
      this.borderOpacityLocal = undefined

      this.faintColorLocal = undefined
      this.faintOpacityLocal = undefined
      this.faintLinkColorLocal = undefined
    },

    /**
     * This applies stored theme data onto form.
     * @param {Object} input - input data
     * @param {Number} version - version of data. 0 means try to guess based on data.
     */
    normalizeLocalState (input, version = 0) {
      const colors = input.colors || input
      const radii = input.radii || input

      if (version === 0) {
        if (input.version) version = input.version
        // Old v1 naming: fg is text, btn is foreground
        if (typeof colors.text === 'undefined' && typeof colors.fg !== 'undefined') {
          version = 1
        }
        // New v2 naming: text is text, fg is foreground
        if (typeof colors.text !== 'undefined' && typeof colors.fg !== 'undefined') {
          version = 2
        }
      }

      console.log('BENIS')
      console.log(version)
      // Stuff that differs between V1 and V2
      if (version === 1) {
        console.log(colors)
        this.fgColorLocal = rgb2hex(colors.btn)
        this.textColorLocal = rgb2hex(colors.fg)
      }

      const keys = new Set(version !== 1 ? Object.keys(colors) : [])
      if (version === 1) {
        // V1 ignores the rest
        this.clearV1()
        keys
          .add('bg')
          .add('link')
          .add('cRed')
          .add('cBlue')
          .add('cGreen')
          .add('cOrange')
      }
      keys.forEach(key => {
        this[key + 'ColorLocal'] = rgb2hex(colors[key])
      })

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
        this.clearV1()
        this.bgColorLocal = this.selected[1]
        this.fgColorLocal = this.selected[2]
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
