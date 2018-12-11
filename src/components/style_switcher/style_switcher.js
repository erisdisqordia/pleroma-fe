import { rgb2hex, hex2rgb, getContrastRatio, alphaBlend } from '../../services/color_convert/color_convert.js'
import { set, delete as del } from 'vue'
import { generateColors, generateShadows, generateRadii, generateFonts, composePreset, getThemes } from '../../services/style_setter/style_setter.js'
import ColorInput from '../color_input/color_input.vue'
import RangeInput from '../range_input/range_input.vue'
import OpacityInput from '../opacity_input/opacity_input.vue'
import ShadowControl from '../shadow_control/shadow_control.vue'
import FontControl from '../font_control/font_control.vue'
import ContrastRatio from '../contrast_ratio/contrast_ratio.vue'
import TabSwitcher from '../tab_switcher/tab_switcher.jsx'
import Preview from './preview.vue'
import ExportImport from '../export_import/export_import.vue'

// List of color values used in v1
const v1OnlyNames = [
  'bg',
  'fg',
  'text',
  'link',
  'cRed',
  'cGreen',
  'cBlue',
  'cOrange'
].map(_ => _ + 'ColorLocal')

export default {
  data () {
    return {
      availableStyles: [],
      selected: this.$store.state.config.theme,

      previewShadows: {},
      previewColors: {},
      previewRadii: {},
      previewFonts: {},

      shadowsInvalid: true,
      colorsInvalid: true,
      radiiInvalid: true,

      keepColor: false,
      keepShadows: false,
      keepOpacity: false,
      keepRoundness: false,
      keepFonts: false,

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
      panelLinkColorLocal: undefined,
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

      cRedColorLocal: '',
      cBlueColorLocal: '',
      cGreenColorLocal: '',
      cOrangeColorLocal: '',

      shadowSelected: undefined,
      shadowsLocal: {},
      fontsLocal: {},

      btnRadiusLocal: '',
      inputRadiusLocal: '',
      checkboxRadiusLocal: '',
      panelRadiusLocal: '',
      avatarRadiusLocal: '',
      avatarAltRadiusLocal: '',
      attachmentRadiusLocal: '',
      tooltipRadiusLocal: ''
    }
  },
  created () {
    const self = this

    getThemes().then((themesComplete) => {
      self.availableStyles = themesComplete
    })
  },
  mounted () {
    this.normalizeLocalState(this.$store.state.config.customTheme)
    if (typeof this.shadowSelected === 'undefined') {
      this.shadowSelected = this.shadowsAvailable[0]
    }
  },
  computed: {
    selectedVersion () {
      return Array.isArray(this.selected) ? 1 : 2
    },
    currentColors () {
      return {
        bg: this.bgColorLocal,
        text: this.textColorLocal,
        link: this.linkColorLocal,

        fg: this.fgColorLocal,
        fgText: this.fgTextColorLocal,
        fgLink: this.fgLinkColorLocal,

        panel: this.panelColorLocal,
        panelText: this.panelTextColorLocal,
        panelLink: this.panelLinkColorLocal,
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
      }
    },
    currentOpacity () {
      return {
        bg: this.bgOpacityLocal,
        btn: this.btnOpacityLocal,
        input: this.inputOpacityLocal,
        panel: this.panelOpacityLocal,
        topBar: this.topBarOpacityLocal,
        border: this.borderOpacityLocal,
        faint: this.faintOpacityLocal
      }
    },
    currentRadii () {
      return {
        btn: this.btnRadiusLocal,
        input: this.inputRadiusLocal,
        checkbox: this.checkboxRadiusLocal,
        panel: this.panelRadiusLocal,
        avatar: this.avatarRadiusLocal,
        avatarAlt: this.avatarAltRadiusLocal,
        tooltip: this.tooltipRadiusLocal,
        attachment: this.attachmentRadiusLocal
      }
    },
    preview () {
      return composePreset(this.previewColors, this.previewRadii, this.previewShadows, this.previewFonts)
    },
    previewTheme () {
      if (!this.preview.theme.colors) return { colors: {}, opacity: {}, radii: {}, shadows: {}, fonts: {} }
      return this.preview.theme
    },
    // This needs optimization maybe
    previewContrast () {
      if (!this.previewTheme.colors.bg) return {}
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
        panelLink: hex2rgb(colors.panelLink),
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
        panelLink: getContrastRatio(alphaBlend(bgs.panel, opacity.panel, fgs.panelLink), fgs.panelLink),

        btnText: getContrastRatio(alphaBlend(bgs.btn, opacity.btn, fgs.btnText), fgs.btnText),

        inputText: getContrastRatio(alphaBlend(bgs.input, opacity.input, fgs.inputText), fgs.inputText),

        topBarText: getContrastRatio(alphaBlend(bgs.topBar, opacity.topBar, fgs.topBarText), fgs.topBarText),
        topBarLink: getContrastRatio(alphaBlend(bgs.topBar, opacity.topBar, fgs.topBarLink), fgs.topBarLink)
      }

      return Object.entries(ratios).reduce((acc, [k, v]) => { acc[k] = hints(v); return acc }, {})
    },
    previewRules () {
      if (!this.preview.rules) return ''
      return [
        ...Object.values(this.preview.rules),
        'color: var(--text)',
        'font-family: var(--interfaceFont, sans-serif)'
      ].join(';')
    },
    shadowsAvailable () {
      return Object.keys(this.previewTheme.shadows).sort()
    },
    currentShadowOverriden: {
      get () {
        return !!this.currentShadow
      },
      set (val) {
        if (val) {
          set(this.shadowsLocal, this.shadowSelected, this.currentShadowFallback.map(_ => Object.assign({}, _)))
        } else {
          del(this.shadowsLocal, this.shadowSelected)
        }
      }
    },
    currentShadowFallback () {
      return this.previewTheme.shadows[this.shadowSelected]
    },
    currentShadow: {
      get () {
        return this.shadowsLocal[this.shadowSelected]
      },
      set (v) {
        set(this.shadowsLocal, this.shadowSelected, v)
      }
    },
    themeValid () {
      return !this.shadowsInvalid && !this.colorsInvalid && !this.radiiInvalid
    },
    exportedTheme () {
      const saveEverything = (
        !this.keepFonts &&
        !this.keepShadows &&
        !this.keepOpacity &&
        !this.keepRoundness &&
        !this.keepColor
      )

      const theme = {}

      if (this.keepFonts || saveEverything) {
        theme.fonts = this.fontsLocal
      }
      if (this.keepShadows || saveEverything) {
        theme.shadows = this.shadowsLocal
      }
      if (this.keepOpacity || saveEverything) {
        theme.opacity = this.currentOpacity
      }
      if (this.keepColor || saveEverything) {
        theme.colors = this.currentColors
      }
      if (this.keepRoundness || saveEverything) {
        theme.radii = this.currentRadii
      }

      return {
        // To separate from other random JSON files and possible future theme formats
        _pleroma_theme_version: 2, theme
      }
    }
  },
  components: {
    ColorInput,
    OpacityInput,
    RangeInput,
    ContrastRatio,
    ShadowControl,
    FontControl,
    TabSwitcher,
    Preview,
    ExportImport
  },
  methods: {
    setCustomTheme () {
      this.$store.dispatch('setOption', {
        name: 'customTheme',
        value: {
          shadows: this.shadowsLocal,
          fonts: this.fontsLocal,
          opacity: this.currentOpacity,
          colors: this.currentColors,
          radii: this.currentRadii
        }
      })
    },
    onImport (parsed) {
      if (parsed._pleroma_theme_version === 1) {
        this.normalizeLocalState(parsed, 1)
      } else if (parsed._pleroma_theme_version === 2) {
        this.normalizeLocalState(parsed.theme, 2)
      }
    },
    importValidator (parsed) {
      const version = parsed._pleroma_theme_version
      return version >= 1 || version <= 2
    },
    clearAll () {
      const state = this.$store.state.config.customTheme
      const version = state.colors ? 2 : 'l1'
      this.normalizeLocalState(this.$store.state.config.customTheme, version)
    },

    // Clears all the extra stuff when loading V1 theme
    clearV1 () {
      Object.keys(this.$data)
        .filter(_ => _.endsWith('ColorLocal') || _.endsWith('OpacityLocal'))
        .filter(_ => !v1OnlyNames.includes(_))
        .forEach(key => {
          set(this.$data, key, undefined)
        })
    },

    clearRoundness () {
      Object.keys(this.$data)
        .filter(_ => _.endsWith('RadiusLocal'))
        .forEach(key => {
          set(this.$data, key, undefined)
        })
    },

    clearOpacity () {
      Object.keys(this.$data)
        .filter(_ => _.endsWith('OpacityLocal'))
        .forEach(key => {
          set(this.$data, key, undefined)
        })
    },

    clearShadows () {
      this.shadowsLocal = {}
    },

    clearFonts () {
      this.fontsLocal = {}
    },

    /**
     * This applies stored theme data onto form. Supports three versions of data:
     * v2 (version = 2) - newer version of themes.
     * v1 (version = 1) - older version of themes (import from file)
     * v1l (version = l1) - older version of theme (load from local storage)
     * v1 and v1l differ because of way themes were stored/exported.
     * @param {Object} input - input data
     * @param {Number} version - version of data. 0 means try to guess based on data. "l1" means v1, locastorage type
     */
    normalizeLocalState (input, version = 0) {
      const colors = input.colors || input
      const radii = input.radii || input
      const opacity = input.opacity
      const shadows = input.shadows || {}
      const fonts = input.fonts || {}

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

      if (!this.keepColor) {
        this.clearV1()
        const keys = new Set(version !== 1 ? Object.keys(colors) : [])
        if (version === 1 || version === 'l1') {
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
      }

      if (!this.keepRoundness) {
        this.clearRoundness()
        Object.entries(radii).forEach(([k, v]) => {
          // 'Radius' is kept mostly for v1->v2 localstorage transition
          const key = k.endsWith('Radius') ? k.split('Radius')[0] : k
          this[key + 'RadiusLocal'] = v
        })
      }

      if (!this.keepShadows) {
        this.clearShadows()
        this.shadowsLocal = shadows
        this.shadowSelected = this.shadowsAvailable[0]
      }

      if (!this.keepFonts) {
        this.clearFonts()
        this.fontsLocal = fonts
      }

      if (opacity && !this.keepOpacity) {
        this.clearOpacity()
        Object.entries(opacity).forEach(([k, v]) => {
          if (typeof v === 'undefined' || v === null || Number.isNaN(v)) return
          this[k + 'OpacityLocal'] = v
        })
      }
    }
  },
  watch: {
    currentRadii () {
      try {
        this.previewRadii = generateRadii({ radii: this.currentRadii })
        this.radiiInvalid = false
      } catch (e) {
        this.radiiInvalid = true
        console.warn(e)
      }
    },
    shadowsLocal: {
      handler () {
        try {
          this.previewShadows = generateShadows({ shadows: this.shadowsLocal })
          this.shadowsInvalid = false
        } catch (e) {
          this.shadowsInvalid = true
          console.warn(e)
        }
      },
      deep: true
    },
    fontsLocal: {
      handler () {
        try {
          this.previewFonts = generateFonts({ fonts: this.fontsLocal })
          this.fontsInvalid = false
        } catch (e) {
          this.fontsInvalid = true
          console.warn(e)
        }
      },
      deep: true
    },
    currentColors () {
      try {
        this.previewColors = generateColors({
          opacity: this.currentOpacity,
          colors: this.currentColors
        })
        this.colorsInvalid = false
      } catch (e) {
        this.colorsInvalid = true
        console.warn(e)
      }
    },
    currentOpacity () {
      try {
        this.previewColors = generateColors({
          opacity: this.currentOpacity,
          colors: this.currentColors
        })
      } catch (e) {
        console.warn(e)
      }
    },
    selected () {
      if (this.selectedVersion === 1) {
        if (!this.keepRoundness) {
          this.clearRoundness()
        }

        if (!this.keepShadows) {
          this.clearShadows()
        }

        if (!this.keepOpacity) {
          this.clearOpacity()
        }

        if (!this.keepColor) {
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
      } else if (this.selectedVersion >= 2) {
        this.normalizeLocalState(this.selected.theme, 2)
      }
    }
  }
}
