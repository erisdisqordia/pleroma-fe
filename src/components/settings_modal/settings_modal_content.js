import TabSwitcher from 'src/components/tab_switcher/tab_switcher.js'

import DataImportExportTab from './tabs/data_import_export_tab.vue'
import MutesAndBlocksTab from './tabs/mutes_and_blocks_tab.vue'
import NotificationsTab from './tabs/notifications_tab.vue'
import FilteringTab from './tabs/filtering_tab.vue'
import SecurityTab from './tabs/security_tab/security_tab.vue'
import ProfileTab from './tabs/profile_tab.vue'
import GeneralTab from './tabs/general_tab.vue'
import VersionTab from './tabs/version_tab.vue'
import ThemeTab from './tabs/theme_tab/theme_tab.vue'

const SettingsModalContent = {
  components: {
    TabSwitcher,

    DataImportExportTab,
    MutesAndBlocksTab,
    NotificationsTab,
    FilteringTab,
    SecurityTab,
    ProfileTab,
    GeneralTab,
    VersionTab,
    ThemeTab
  },
  computed: {
    isLoggedIn () {
      return !!this.$store.state.users.currentUser
    }
  }
}

export default SettingsModalContent
