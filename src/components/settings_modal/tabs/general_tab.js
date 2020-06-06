import Checkbox from 'src/components/checkbox/checkbox.vue'
import InterfaceLanguageSwitcher from 'src/components/interface_language_switcher/interface_language_switcher.vue'

import SharedComputedObject from '../helpers/shared_computed_object.js'

const GeneralTab = {
  data () {
    return {
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
    Checkbox,
    InterfaceLanguageSwitcher
  },
  computed: {
    postFormats () {
      return this.$store.state.instance.postFormats || []
    },
    instanceSpecificPanelPresent () { return this.$store.state.instance.showInstanceSpecificPanel },
    ...SharedComputedObject()
  }
}

export default GeneralTab
