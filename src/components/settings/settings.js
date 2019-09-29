/* eslint-env browser */
import { filter, trim } from 'lodash'

import TabSwitcher from '../tab_switcher/tab_switcher.js'
import StyleSwitcher from '../style_switcher/style_switcher.vue'
import InterfaceLanguageSwitcher from '../interface_language_switcher/interface_language_switcher.vue'
import { extractCommit } from '../../services/version/version.service'
import { instanceDefaultProperties, defaultState as configDefaultState } from '../../modules/config.js'

const pleromaFeCommitUrl = 'https://git.pleroma.social/pleroma/pleroma-fe/commit/'
const pleromaBeCommitUrl = 'https://git.pleroma.social/pleroma/pleroma/commit/'

const settings = {
  data () {
    const instance = this.$store.state.instance

    return {
      loopSilentAvailable:
        // Firefox
        Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'mozHasAudio') ||
        // Chrome-likes
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'webkitAudioDecodedByteCount') ||
        // Future spec, still not supported in Nightly 63 as of 08/2018
        Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'audioTracks'),

      backendVersion: instance.backendVersion,
      frontendVersion: instance.frontendVersion
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
    },
    postFormats () {
      return this.$store.state.instance.postFormats || []
    },
    instanceSpecificPanelPresent () { return this.$store.state.instance.showInstanceSpecificPanel },
    frontendVersionLink () {
      return pleromaFeCommitUrl + this.frontendVersion
    },
    backendVersionLink () {
      return pleromaBeCommitUrl + extractCommit(this.backendVersion)
    },
    // Getting localized values for instance-default properties
    ...instanceDefaultProperties
      .map(key => [
        key + 'LocalizedValue',
        function () {
          return this.$t('settings.values.' + this.$store.getters.instanceDefaultConfig[key])
        }
      ])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    // Generating computed values for vuex properties
    ...Object.keys(configDefaultState)
      .map(key => [key, {
        get () { return this.$store.getters.mergedConfig[key] },
        set (value) {
          this.$store.dispatch('setOption', { name: key, value })
        }
      }])
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    // Special cases (need to transform values)
    muteWordsString: {
      get () { return this.$store.getters.mergedConfig.muteWords.join('\n') },
      set (value) {
        this.$store.dispatch('setOption', {
          name: 'muteWords',
          value: filter(value.split('\n'), (word) => trim(word).length > 0)
        })
      }
    }
  },
  // Updating nested properties
  watch: {
    notificationVisibility: {
      handler (value) {
        this.$store.dispatch('setOption', {
          name: 'notificationVisibility',
          value: this.$store.state.config.notificationVisibility
        })
      },
      deep: true
    }
  }
}

export default settings
