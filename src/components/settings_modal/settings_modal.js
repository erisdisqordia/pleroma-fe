import Modal from 'src/components/modal/modal.vue'
import PanelLoading from 'src/components/panel_loading/panel_loading.vue'
import AsyncComponentError from 'src/components/async_component_error/async_component_error.vue'
import getResettableAsyncComponent from 'src/services/resettable_async_component.js'

const SettingsModal = {
  components: {
    Modal,
    SettingsModalContent: getResettableAsyncComponent(
      () => import('./settings_modal_content.vue'),
      {
        loading: PanelLoading,
        error: AsyncComponentError,
        delay: 0
      }
    )
  },
  methods: {
    closeModal () {
      this.$store.dispatch('closeSettingsModal')
    },
    peekModal () {
      this.$store.dispatch('togglePeekSettingsModal')
    }
  },
  computed: {
    currentSaveStateNotice () {
      return this.$store.state.interface.settings.currentSaveStateNotice
    },
    modalActivated () {
      return this.$store.state.interface.settingsModalState !== 'hidden'
    },
    modalOpenedOnce () {
      return this.$store.state.interface.settingsModalLoaded
    },
    modalPeeked () {
      return this.$store.state.interface.settingsModalState === 'minimized'
    }
  }
}

export default SettingsModal
