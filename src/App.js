import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import InstanceSpecificPanel from './components/instance_specific_panel/instance_specific_panel.vue'
import FeaturesPanel from './components/features_panel/features_panel.vue'
import WhoToFollowPanel from './components/who_to_follow_panel/who_to_follow_panel.vue'
import ChatPanel from './components/chat_panel/chat_panel.vue'
import SettingsModal from './components/settings_modal/settings_modal.vue'
import MediaModal from './components/media_modal/media_modal.vue'
import SideDrawer from './components/side_drawer/side_drawer.vue'
import MobilePostStatusButton from './components/mobile_post_status_button/mobile_post_status_button.vue'
import MobileNav from './components/mobile_nav/mobile_nav.vue'
import DesktopNav from './components/desktop_nav/desktop_nav.vue'
import UserReportingModal from './components/user_reporting_modal/user_reporting_modal.vue'
import PostStatusModal from './components/post_status_modal/post_status_modal.vue'
import GlobalNoticeList from './components/global_notice_list/global_notice_list.vue'
import { windowWidth, windowHeight } from './services/window_utils/window_utils'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    InstanceSpecificPanel,
    FeaturesPanel,
    WhoToFollowPanel,
    ChatPanel,
    MediaModal,
    SideDrawer,
    MobilePostStatusButton,
    MobileNav,
    DesktopNav,
    SettingsModal,
    UserReportingModal,
    PostStatusModal,
    GlobalNoticeList
  },
  data: () => ({
    mobileActivePanel: 'timeline'
  }),
  created () {
    // Load the locale from the storage
    const val = this.$store.getters.mergedConfig.interfaceLanguage
    this.$store.dispatch('setOption', { name: 'interfaceLanguage', value: val })
    window.addEventListener('resize', this.updateMobileState)
  },
  destroyed () {
    window.removeEventListener('resize', this.updateMobileState)
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    background () {
      return this.currentUser.background_image || this.$store.state.instance.background
    },
    bgStyle () {
      return {
        'background-image': `url(${this.background})`
      }
    },
    bgAppStyle () {
      return {
        '--body-background-image': `url(${this.background})`
      }
    },
    chat () { return this.$store.state.chat.channel.state === 'joined' },
    suggestionsEnabled () { return this.$store.state.instance.suggestionsEnabled },
    showInstanceSpecificPanel () {
      return this.$store.state.instance.showInstanceSpecificPanel &&
        !this.$store.getters.mergedConfig.hideISP &&
        this.$store.state.instance.instanceSpecificPanelContent
    },
    showFeaturesPanel () { return this.$store.state.instance.showFeaturesPanel },
    isMobileLayout () { return this.$store.state.interface.mobileLayout },
    privateMode () { return this.$store.state.instance.private },
    sidebarAlign () {
      return {
        'order': this.$store.state.instance.sidebarRight ? 99 : 0
      }
    }
  },
  methods: {
    updateMobileState () {
      const mobileLayout = windowWidth() <= 800
      const layoutHeight = windowHeight()
      const changed = mobileLayout !== this.isMobileLayout
      if (changed) {
        this.$store.dispatch('setMobileLayout', mobileLayout)
      }
      this.$store.dispatch('setLayoutHeight', layoutHeight)
    }
  }
}
