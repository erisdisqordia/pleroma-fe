/* eslint-env browser */
import StyleSwitcher from '../style_switcher/style_switcher.vue'
import { filter, trim } from 'lodash'

const settings = {
  data () {
    return {
      hideAttachmentsLocal: this.$store.state.config.hideAttachments,
      hideAttachmentsInConvLocal: this.$store.state.config.hideAttachmentsInConv,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      loopVideoLocal: this.$store.state.config.loopVideo,
      loopVideoSilentOnlyLocal: this.$store.state.config.loopVideoSilentOnly,
      muteWordsString: this.$store.state.config.muteWords.join('\n'),
      autoLoadLocal: this.$store.state.config.autoLoad,
      streamingLocal: this.$store.state.config.streaming,
      pauseOnUnfocusedLocal: this.$store.state.config.pauseOnUnfocused,
      hoverPreviewLocal: this.$store.state.config.hoverPreview,
      collapseMessageWithSubjectLocal: this.$store.state.config.collapseMessageWithSubject,
      stopGifs: this.$store.state.config.stopGifs,
      loopSilentAvailable:
        // Firefox
        Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'mozHasAudio') ||
        // Chrome-likes
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'webkitAudioDecodedByteCount') ||
        // Future spec, still not supported in Nightly 63 as of 08/2018
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'audioTracks')
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
    loopVideoLocal (value) {
      this.$store.dispatch('setOption', { name: 'loopVideo', value })
    },
    loopVideoSilentOnlyLocal (value) {
      this.$store.dispatch('setOption', { name: 'loopVideoSilentOnly', value })
    },
    autoLoadLocal (value) {
      this.$store.dispatch('setOption', { name: 'autoLoad', value })
    },
    streamingLocal (value) {
      this.$store.dispatch('setOption', { name: 'streaming', value })
    },
    pauseOnUnfocusedLocal (value) {
      this.$store.dispatch('setOption', { name: 'pauseOnUnfocused', value })
    },
    hoverPreviewLocal (value) {
      this.$store.dispatch('setOption', { name: 'hoverPreview', value })
    },
    muteWordsString (value) {
      value = filter(value.split('\n'), (word) => trim(word).length > 0)
      this.$store.dispatch('setOption', { name: 'muteWords', value })
    },
    collapseMessageWithSubjectLocal (value) {
      this.$store.dispatch('setOption', { name: 'collapseMessageWithSubject', value })
    },
    stopGifs (value) {
      this.$store.dispatch('setOption', { name: 'stopGifs', value })
    }
  }
}

export default settings
