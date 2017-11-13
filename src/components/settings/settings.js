import StyleSwitcher from '../style_switcher/style_switcher.vue'
import { filter, trim } from 'lodash'

const settings = {
  data () {
    return {
      hideAttachmentsLocal: this.$store.state.config.hideAttachments,
      hideAttachmentsInConvLocal: this.$store.state.config.hideAttachmentsInConv,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      muteWordsString: this.$store.state.config.muteWords.join('\n'),
      autoLoadLocal: this.$store.state.config.autoLoad,
      streamingLocal: this.$store.state.config.streaming,
      hoverPreviewLocal: this.$store.state.config.hoverPreview,
      bgColorLocal: '',
      fgColorLocal: '',
      linkColorLocal: ''
    }
  },
  components: {
    StyleSwitcher
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    setCustomTheme () {
      if (!this.bgColorLocal && !this.fgColorLocal && !this.linkColorLocal) {
        // reset to picked themes
      }
      const rgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
      }
      const bgRgb = rgb(this.bgColorLocal)
      const fgRgb = rgb(this.fgColorLocal)
      const linkRgb = rgb(this.linkColorLocal)
      if (bgRgb && fgRgb && linkRgb) {
        console.log('all colors ok')
        this.$store.dispatch('setOption', { name: 'customTheme', value: {
          fg: fgRgb,
          bg: bgRgb,
          link: linkRgb
        }})
      }
    }
  },
  watch: {
    hideAttachmentsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachments', value })
    },
    hideAttachmentsInConvLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachmentsInConv', value })
    },
    hideNsfwLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideNsfw', value })
    },
    autoLoadLocal (value) {
      this.$store.dispatch('setOption', { name: 'autoLoad', value })
    },
    streamingLocal (value) {
      this.$store.dispatch('setOption', { name: 'streaming', value })
    },
    hoverPreviewLocal (value) {
      this.$store.dispatch('setOption', { name: 'hoverPreview', value })
    },
    muteWordsString (value) {
      value = filter(value.split('\n'), (word) => trim(word).length > 0)
      this.$store.dispatch('setOption', { name: 'muteWords', value })
    }
  }
}

export default settings
