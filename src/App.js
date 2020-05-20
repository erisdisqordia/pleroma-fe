import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import SearchBar from './components/search_bar/search_bar.vue'
import InstanceSpecificPanel from './components/instance_specific_panel/instance_specific_panel.vue'
import FeaturesPanel from './components/features_panel/features_panel.vue'
import WhoToFollowPanel from './components/who_to_follow_panel/who_to_follow_panel.vue'
import ChatPanel from './components/chat_panel/chat_panel.vue'
import MediaModal from './components/media_modal/media_modal.vue'
import SideDrawer from './components/side_drawer/side_drawer.vue'
import MobilePostStatusButton from './components/mobile_post_status_button/mobile_post_status_button.vue'
import MobileNav from './components/mobile_nav/mobile_nav.vue'
import UserReportingModal from './components/user_reporting_modal/user_reporting_modal.vue'
import PostStatusModal from './components/post_status_modal/post_status_modal.vue'
import { windowWidth } from './services/window_utils/window_utils'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    SearchBar,
    InstanceSpecificPanel,
    FeaturesPanel,
    WhoToFollowPanel,
    ChatPanel,
    MediaModal,
    SideDrawer,
    MobilePostStatusButton,
    MobileNav,
    UserReportingModal,
    PostStatusModal
  },
  data: () => ({
    mobileActivePanel: 'timeline',
    searchBarHidden: true,
    supportsMask: window.CSS && window.CSS.supports && (
      window.CSS.supports('mask-size', 'contain') ||
        window.CSS.supports('-webkit-mask-size', 'contain') ||
        window.CSS.supports('-moz-mask-size', 'contain') ||
        window.CSS.supports('-ms-mask-size', 'contain') ||
        window.CSS.supports('-o-mask-size', 'contain')
    )
  }),
  created () {
    // Load the locale from the storage
    this.$i18n.locale = this.$store.getters.mergedConfig.interfaceLanguage
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
    enableMask () { return this.supportsMask && this.$store.state.instance.logoMask },
    logoStyle () {
      return {
        'visibility': this.enableMask ? 'hidden' : 'visible'
      }
    },
    logoMaskStyle () {
      return this.enableMask ? {
        'mask-image': `url(${this.$store.state.instance.logo})`
      } : {
        'background-color': this.enableMask ? '' : 'transparent'
      }
    },
    logoBgStyle () {
      return Object.assign({
        'margin': `${this.$store.state.instance.logoMargin} 0`,
        opacity: this.searchBarHidden ? 1 : 0
      }, this.enableMask ? {} : {
        'background-color': this.enableMask ? '' : 'transparent'
      })
    },
    logo () { return this.$store.state.instance.logo },
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
    sitename () { return this.$store.state.instance.name },
    chat () { return this.$store.state.chat.channel.state === 'joined' },
    hideSitename () { return this.$store.state.instance.hideSitename },
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
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    logout () {
      this.$router.replace('/main/public')
      this.$store.dispatch('logout')
    },
    onSearchBarToggled (hidden) {
      this.searchBarHidden = hidden
    },
    updateMobileState () {
      const mobileLayout = windowWidth() <= 800
      const changed = mobileLayout !== this.isMobileLayout
      if (changed) {
        this.$store.dispatch('setMobileLayout', mobileLayout)
      }
    }
  }
}
