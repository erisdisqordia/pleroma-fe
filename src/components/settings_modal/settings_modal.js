import Modal from 'src/components/modal/modal.vue'
import BigSpinner from 'src/components/big_spinner/big_spinner.vue'
import ErrorWindow from 'src/components/error_window/error_window.vue'
import getResettableAsyncComponent from 'src/services/resettable_async_component.js'

const SettingsModal = {
  components: {
    Modal,
    SettingsModalContent: getResettableAsyncComponent(
      () => import('./settings_modal_content.vue'),
      {
        loading: BigSpinner,
        error: ErrorWindow,
        delay: 0
      }
    )
  },
  computed: {
    modalActivated () {
      return this.$store.state.interface.settingsModalState !== 'hidden'
    },
    modalPeeked () {
      return this.$store.state.interface.settingsModalState === 'minimized'
    }
  }
}

export default SettingsModal
