import { rgb2hex, hex2rgb, getContrastRatio, alphaBlend } from '../../services/color_convert/color_convert.js'
import ColorInput from '../color_input/color_input.vue'
import ShadowControl from '../shadow_control/shadow_control.vue'
import ContrastRatio from '../contrast_ratio/contrast_ratio.vue'
import OpacityInput from '../opacity_input/opacity_input.vue'
import StyleSetter from '../../services/style_setter/style_setter.js'
import TabSwitcher from '../tab_switcher/tab_switcher.jsx'

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

      alertErrorColorLocal: undefined,

      badgeOpacityLocal: undefined,
      badgeNotificationColorLocal: undefined,

      borderColorLocal: undefined,
      borderOpacityLocal: undefined,

      faintColorLocal: undefined,
      faintOpacityLocal: undefined,
      faintLinkColorLocal: undefined,

      shadowSelected: undefined,
      shadowsLocal: {},

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

          alertError: this.alertErrorColorLocal,
          badgeNotification: this.badgeNotificationColorLocal,

          faint: this.faintColorLocal,
          faintLink: this.faintLinkColorLocal,
          border: this.borderColorLocal,

          cRed: this.cRedColorLocal,
          cBlue: this.cBlueColorLocal,
          cGreen: this.cGreenColorLocal,
          cOrange: this.cOrangeColorLocal
        },
        opacity: {
          bg: this.bgOpacityLocal,
          btn: this.btnOpacityLocal,
          input: this.inputOpacityLocal,
          panel: this.panelOpacityLocal,
          topBar: this.topBarOpacityLocal,
          border: this.borderOpacityLocal,
          faint: this.faintOpacityLocal
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
      if (!this.preview.theme) return { colors: {}, opacity: {}, radii: {} }
      return this.preview.theme
    },
    previewContrast () {
      if (!this.previewTheme.colors) return {}
      const colors = this.previewTheme.colors
      const opacity = this.previewTheme.opacity
      if (!colors.bg) return {}
      const hints = (ratio) => ({
        text: ratio.toPrecision(3) + ':1',
        // AA level, AAA level
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
        // same but for 18pt+ texts
        laa: ratio >= 3,
        laaa: ratio >= 4.5
      })

      // fgsfds :DDDD
      const fgs = {
        text: hex2rgb(colors.text),
        panelText: hex2rgb(colors.panelText),
        btnText: hex2rgb(colors.btnText),
        topBarText: hex2rgb(colors.topBarText),
        inputText: hex2rgb(colors.inputText),

        link: hex2rgb(colors.link),
        topBarLink: hex2rgb(colors.topBarLink),

        red: hex2rgb(colors.cRed),
        green: hex2rgb(colors.cGreen),
        blue: hex2rgb(colors.cBlue),
        orange: hex2rgb(colors.cOrange)
      }

      const bgs = {
        bg: hex2rgb(colors.bg),
        btn: hex2rgb(colors.btn),
        panel: hex2rgb(colors.panel),
        topBar: hex2rgb(colors.topBar),
        input: hex2rgb(colors.input),
        alertError: hex2rgb(colors.alertError),
        badgeNotification: hex2rgb(colors.badgeNotification)
      }

      /* This is a bit confusing because "bottom layer" used is text color
       * This is done to get worst case scenario when background below transparent
       * layer matches text color, making it harder to read the lower alpha is.
       */
      const ratios = {
        bgText: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.text), fgs.text),
        bgLink: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.link), fgs.link),
        bgRed: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.red), fgs.red),
        bgGreen: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.green), fgs.green),
        bgBlue: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.blue), fgs.blue),
        bgOrange: getContrastRatio(alphaBlend(bgs.bg, opacity.bg, fgs.orange), fgs.orange),

        tintText: getContrastRatio(alphaBlend(bgs.bg, 0.5, fgs.panelText), fgs.text),

        panelText: getContrastRatio(alphaBlend(bgs.panel, opacity.panel, fgs.panelText), fgs.panelText),

        btnText: getContrastRatio(alphaBlend(bgs.btn, opacity.btn, fgs.btnText), fgs.btnText),

        inputText: getContrastRatio(alphaBlend(bgs.input, opacity.input, fgs.inputText), fgs.inputText),

        topBarText: getContrastRatio(alphaBlend(bgs.topBar, opacity.topBar, fgs.topBarText), fgs.topBarText),
        topBarLink: getContrastRatio(alphaBlend(bgs.topBar, opacity.topBar, fgs.topBarLink), fgs.topBarLink)
      }

      return Object.entries(ratios).reduce((acc, [k, v]) => { acc[k] = hints(v); return acc }, {})
    },
    previewRules () {
      if (!this.preview.colorRules) return ''
      return [this.preview.colorRules, this.preview.radiiRules, 'color: var(--text)'].join(';')
    },
    shadowsAvailable () {
      return Object.keys(this.preview.theme.shadows)
    },
    currentShadow () {
      const fallback = this.preview.theme.shadows[this.shadowSelected];
      return fallback ? {
        fallback,
        value: this.shadowsLocal[this.shadowSelected]
      } : undefined
    }
  },
  components: {
    ColorInput,
    OpacityInput,
    ContrastRatio,
    ShadowControl,
    TabSwitcher
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
      this.panelFaintColorLocal = undefined
      this.panelOpacityLocal = undefined

      this.topBarColorLocal = undefined
      this.topBarTextColorLocal = undefined
      this.topBarLinkColorLocal = undefined
      this.topBarOpacityLocal = undefined

      this.borderColorLocal = undefined
      this.borderOpacityLocal = undefined

      this.faintColorLocal = undefined
      this.faintOpacityLocal = undefined
      this.faintLinkColorLocal = undefined

      this.alertErrorColorLocal = undefined

      this.badgeNotificationColorLocal = undefined
    },

    /**
     * This applies stored theme data onto form.
     * @param {Object} input - input data
     * @param {Number} version - version of data. 0 means try to guess based on data.
     */
    normalizeLocalState (input, version = 0) {
      const colors = input.colors || input
      const radii = input.radii || input
      const opacity = input.opacity || input
      const shadows = input.shadows || {}

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

      // Stuff that differs between V1 and V2
      if (version === 1) {
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

      // TODO optimize this
      this.btnRadiusLocal = radii.btnRadius || 4
      this.inputRadiusLocal = radii.inputRadius || 4
      this.panelRadiusLocal = radii.panelRadius || 10
      this.avatarRadiusLocal = radii.avatarRadius || 5
      this.avatarAltRadiusLocal = radii.avatarAltRadius || 50
      this.tooltipRadiusLocal = radii.tooltipRadius || 2
      this.attachmentRadiusLocal = radii.attachmentRadius || 5

      this.shadowsLocal = shadows

      Object.entries(opacity).forEach(([k, v]) => {
        if (typeof v === 'undefined' || v === null || Number.isNaN(v)) return
        this[k + 'OpacityLocal'] = v
      })
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
        this.cRedColorLocal = this.selected[5]
        this.cGreenColorLocal = this.selected[6]
        this.cBlueColorLocal = this.selected[7]
        this.cOrangeColorLocal = this.selected[8]
      }
    }
  }
}
