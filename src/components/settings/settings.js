import StyleSwitcher from '../style_switcher/style_switcher.vue'

const settings = {
  data () {
    return {
      hideAttachmentsLocal: this.$store.state.config.hideAttachments,
      hideNsfwLocal: this.$store.state.config.hideNsfw
    }
  },
  components: {
    StyleSwitcher
  },
  watch: {
    hideAttachmentsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachments', value })
    },
    hideNsfwLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideNsfw', value })
    }
  }
}

export default settings
