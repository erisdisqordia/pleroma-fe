import Modal from 'src/components/modal/modal.vue'

const SettingsModal = {
  components: {
    Modal,
    SettingsModalContent: () => import('./settings_modal_content.vue')
  },
  computed: {
    modalActivated () {
      return this.$store.state.interface.settingsModalState !== 'hidden'
    },
    modalPeeked () {
      return this.$store.state.interface.settingsModalState === 'minimized'
    }
  },
}

export default SettingsModal
