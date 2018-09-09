/* eslint-env browser */
import TabSwitcher from '../tab_switcher/tab_switcher.jsx'
import StyleSwitcher from '../style_switcher/style_switcher.vue'
import InterfaceLanguageSwitcher from '../interface_language_switcher/interface_language_switcher.vue'
import { filter, trim } from 'lodash'

const settings = {
  data () {
    const config = this.$store.state.config

    return {
      hideAttachmentsLocal: config.hideAttachments,
      hideAttachmentsInConvLocal: config.hideAttachmentsInConv,
      hideNsfwLocal: config.hideNsfw,
      notificationVisibilityLocal: config.notificationVisibility,
      replyVisibilityLocal: config.replyVisibility,
      loopVideoLocal: config.loopVideo,
      loopVideoSilentOnlyLocal: config.loopVideoSilentOnly,
      muteWordsString: config.muteWords.join('\n'),
      autoLoadLocal: config.autoLoad,
      streamingLocal: config.streaming,
      pauseOnUnfocusedLocal: config.pauseOnUnfocused,
      hoverPreviewLocal: config.hoverPreview,
      collapseMessageWithSubjectLocal: typeof config.collapseMessageWithSubject === 'undefined'
        ? config.defaultCollapseMessageWithSubject
        : config.collapseMessageWithSubject,
      stopGifs: config.stopGifs,
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
    TabSwitcher,
    StyleSwitcher,
    InterfaceLanguageSwitcher
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
    'notificationVisibilityLocal.likes' (value) {
      this.$store.dispatch('setOption', { name: 'notificationVisibility', value: this.$store.state.config.notificationVisibility })
    },
    'notificationVisibilityLocal.follows' (value) {
      this.$store.dispatch('setOption', { name: 'notificationVisibility', value: this.$store.state.config.notificationVisibility })
    },
    'notificationVisibilityLocal.repeats' (value) {
      this.$store.dispatch('setOption', { name: 'notificationVisibility', value: this.$store.state.config.notificationVisibility })
    },
    'notificationVisibilityLocal.mentions' (value) {
      this.$store.dispatch('setOption', { name: 'notificationVisibility', value: this.$store.state.config.notificationVisibility })
    },
    replyVisibilityLocal (value) {
      this.$store.dispatch('setOption', { name: 'replyVisibility', value })
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
