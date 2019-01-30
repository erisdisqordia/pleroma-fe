import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import UserFinder from './components/user_finder/user_finder.vue'
import InstanceSpecificPanel from './components/instance_specific_panel/instance_specific_panel.vue'
import FeaturesPanel from './components/features_panel/features_panel.vue'
import WhoToFollowPanel from './components/who_to_follow_panel/who_to_follow_panel.vue'
import ChatPanel from './components/chat_panel/chat_panel.vue'
import MediaModal from './components/media_modal/media_modal.vue'
import SideDrawer from './components/side_drawer/side_drawer.vue'
import { unseenNotificationsFromStore } from './services/notification_utils/notification_utils'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    UserFinder,
    InstanceSpecificPanel,
    FeaturesPanel,
    WhoToFollowPanel,
    ChatPanel,
    MediaModal,
    SideDrawer
  },
  data: () => ({
    mobileActivePanel: 'timeline',
    finderHidden: true,
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
    this.$i18n.locale = this.$store.state.config.interfaceLanguage
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
        opacity: this.finderHidden ? 1 : 0
      }, this.enableMask ? {} : {
        'background-color': this.enableMask ? '' : 'transparent'
      })
    },
    logo () { return this.$store.state.instance.logo },
    style () {
      return {
        '--body-background-image': `url(${this.background})`,
        'background-image': `url(${this.background})`
      }
    },
    sitename () { return this.$store.state.instance.name },
    chat () { return this.$store.state.chat.channel.state === 'joined' },
    suggestionsEnabled () { return this.$store.state.instance.suggestionsEnabled },
    showInstanceSpecificPanel () { return this.$store.state.instance.showInstanceSpecificPanel },
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    unseenNotificationsCount () {
      return this.unseenNotifications.length
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
    onFinderToggled (hidden) {
      this.finderHidden = hidden
    },
    toggleMobileSidebar () {
      this.$refs.sideDrawer.toggleDrawer()
    }
  }
}
