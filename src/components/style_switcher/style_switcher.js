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
      this.$store.dispatch('setOption', { name: 'theme', value: this.selected })
    }
  }
}
