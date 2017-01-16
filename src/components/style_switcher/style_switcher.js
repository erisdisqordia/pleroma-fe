import StyleSetter from '../../services/style_setter/style_setter.js'

export default {
  data: () => ({
    availableStyles: [],
    selected: false
  }),
  created () {
    const self = this
    window.fetch('/static/css/themes.json')
      .then((data) => data.json())
      .then((themes) => { self.availableStyles = themes })
  },
  watch: {
    selected () {
      const fullPath = `/static/css/${this.selected}`
      StyleSetter.setStyle(fullPath)
    }
  }
}
