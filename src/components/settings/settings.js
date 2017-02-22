import StyleSwitcher from '../style_switcher/style_switcher.vue'

const settings = {
  data () {
    return {
      hideAttachmentsLocal: this.$store.state.config.hideAttachments
    }
  },
  components: {
    StyleSwitcher
  },
  watch: {
    hideAttachmentsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachments', value })
    }
  }
}

export default settings
