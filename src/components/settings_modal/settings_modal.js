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
  methods: {
    closeModal () {
      this.$store.dispatch('closeSettingsModal')
    },
    peekModal () {
      this.$store.dispatch('togglePeekSettingsModal')
    }
  }
}

export default SettingsModal
