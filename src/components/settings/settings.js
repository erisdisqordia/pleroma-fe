/* eslint-env browser */
import TabSwitcher from '../tab_switcher/tab_switcher.jsx'
import StyleSwitcher from '../style_switcher/style_switcher.vue'
import InterfaceLanguageSwitcher from '../interface_language_switcher/interface_language_switcher.vue'
import { filter, trim } from 'lodash'

const settings = {
  data () {
    const user = this.$store.state.config
    const instance = this.$store.state.instance

    return {
      hideAttachmentsLocal: user.hideAttachments,
      hideAttachmentsInConvLocal: user.hideAttachmentsInConv,
      hideNsfwLocal: user.hideNsfw,
      useOneClickNsfw: user.useOneClickNsfw,
      hideISPLocal: user.hideISP,
      preloadImage: user.preloadImage,

      hidePostStatsLocal: typeof user.hidePostStats === 'undefined'
        ? instance.hidePostStats
        : user.hidePostStats,
      hidePostStatsDefault: this.$t('settings.values.' + instance.hidePostStats),

      hideUserStatsLocal: typeof user.hideUserStats === 'undefined'
        ? instance.hideUserStats
        : user.hideUserStats,
      hideUserStatsDefault: this.$t('settings.values.' + instance.hideUserStats),

      notificationVisibilityLocal: user.notificationVisibility,
      replyVisibilityLocal: user.replyVisibility,
      loopVideoLocal: user.loopVideo,
      muteWordsString: user.muteWords.join('\n'),
      autoLoadLocal: user.autoLoad,
      streamingLocal: user.streaming,
      pauseOnUnfocusedLocal: user.pauseOnUnfocused,
      hoverPreviewLocal: user.hoverPreview,

      collapseMessageWithSubjectLocal: typeof user.collapseMessageWithSubject === 'undefined'
        ? instance.collapseMessageWithSubject
        : user.collapseMessageWithSubject,
      collapseMessageWithSubjectDefault: this.$t('settings.values.' + instance.collapseMessageWithSubject),

      subjectLineBehaviorLocal: typeof user.subjectLineBehavior === 'undefined'
        ? instance.subjectLineBehavior
        : user.subjectLineBehavior,
      subjectLineBehaviorDefault: instance.subjectLineBehavior,

      alwaysShowSubjectInputLocal: typeof user.alwaysShowSubjectInput === 'undefined'
        ? instance.alwaysShowSubjectInput
        : user.alwaysShowSubjectInput,
      alwaysShowSubjectInputDefault: instance.alwaysShowSubjectInput,

      scopeCopyLocal: typeof user.scopeCopy === 'undefined'
        ? instance.scopeCopy
        : user.scopeCopy,
      scopeCopyDefault: this.$t('settings.values.' + instance.scopeCopy),

      stopGifs: user.stopGifs,
      webPushNotificationsLocal: user.webPushNotifications,
      loopVideoSilentOnlyLocal: user.loopVideosSilentOnly,
      loopSilentAvailable:
        // Firefox
        Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'mozHasAudio') ||
        // Chrome-likes
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'webkitAudioDecodedByteCount') ||
        // Future spec, still not supported in Nightly 63 as of 08/2018
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'audioTracks'),
      playVideosInline: user.playVideosInline,
      useContainFit: user.useContainFit
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
    },
    currentSaveStateNotice () {
      return this.$store.state.interface.settings.currentSaveStateNotice
    }
  },
  watch: {
    hideAttachmentsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachments', value })
    },
    hideAttachmentsInConvLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideAttachmentsInConv', value })
    },
    hidePostStatsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hidePostStats', value })
    },
    hideUserStatsLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideUserStats', value })
    },
    hideNsfwLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideNsfw', value })
    },
    useOneClickNsfw (value) {
      this.$store.dispatch('setOption', { name: 'useOneClickNsfw', value })
    },
    preloadImage (value) {
      this.$store.dispatch('setOption', { name: 'preloadImage', value })
    },
    hideISPLocal (value) {
      this.$store.dispatch('setOption', { name: 'hideISP', value })
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
    scopeCopyLocal (value) {
      this.$store.dispatch('setOption', { name: 'scopeCopy', value })
    },
    alwaysShowSubjectInputLocal (value) {
      this.$store.dispatch('setOption', { name: 'alwaysShowSubjectInput', value })
    },
    subjectLineBehaviorLocal (value) {
      this.$store.dispatch('setOption', { name: 'subjectLineBehavior', value })
    },
    stopGifs (value) {
      this.$store.dispatch('setOption', { name: 'stopGifs', value })
    },
    webPushNotificationsLocal (value) {
      this.$store.dispatch('setOption', { name: 'webPushNotifications', value })
      if (value) this.$store.dispatch('registerPushNotifications')
    },
    playVideosInline (value) {
      this.$store.dispatch('setOption', { name: 'playVideosInline', value })
    },
    useContainFit (value) {
      this.$store.dispatch('setOption', { name: 'useContainFit', value })
    }
  }
}

export default settings
