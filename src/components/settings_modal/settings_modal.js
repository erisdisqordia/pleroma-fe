import Modal from '../modal/modal.vue'
import TabSwitcher from '../tab_switcher/tab_switcher.js'

import Profile from './tabs/profile.vue'
import Security from './tabs/security.vue'
import Notifications from './tabs/notifications.vue'
import DataImportExport from './tabs/data_import_export.vue'
import MutesAndBlocks from './tabs/mutes_and_blocks.vue'

const SettingsModal = {
  components: {
    Modal,
    TabSwitcher,
    Profile,
    Security,
    Notifications,
    DataImportExport,
    MutesAndBlocks
  },
  data () {
    return {
      resettingForm: false
    }
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.users.currentUser
    },
    modalActivated () {
      return this.$store.state.interface.settingsModalState !== 'hidden'
    }
  },
  watch: {
  },
  methods: {
  }
}

export default SettingsModal
