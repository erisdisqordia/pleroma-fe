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
        console.log(themes)
        self.availableStyles = themes
      })
  },
  mounted () {
    const rgbstr2hex = (rgb) => {
      if (rgb[0] === '#') {
        return rgb
      }
      rgb = rgb.match(/\d+/g)
      return `#${((Number(rgb[0]) << 16) + (Number(rgb[1]) << 8) + Number(rgb[2])).toString(16)}`
    }
    this.bgColorLocal = rgbstr2hex(this.$store.state.config.colors['base00'])
    this.fgColorLocal = rgbstr2hex(this.$store.state.config.colors['base02'])
    console.log(this.$store.state.config.colors['base02'])
    console.log(this.fgColorLocal)
    this.textColorLocal = rgbstr2hex(this.$store.state.config.colors['base05'])
    this.linkColorLocal = rgbstr2hex(this.$store.state.config.colors['base08'])
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
        console.log('all colors ok')
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
