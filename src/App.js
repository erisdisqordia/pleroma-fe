import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import UserFinder from './components/user_finder/user_finder.vue'
import WhoToFollowPanel from './components/who_to_follow_panel/who_to_follow_panel.vue'
import InstanceSpecificPanel from './components/instance_specific_panel/instance_specific_panel.vue'
import ChatPanel from './components/chat_panel/chat_panel.vue'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    UserFinder,
    WhoToFollowPanel,
    InstanceSpecificPanel,
    ChatPanel
  },
  data: () => ({
    mobileActivePanel: 'timeline',
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
      return this.currentUser.background_image || this.$store.state.config.background
    },
    enableMask () { return this.supportsMask && this.$store.state.config.logoMask },
    logoStyle () {
      return {
        'visibility': this.enableMask ? 'hidden' : 'visible'
      }
    },
    logoMaskStyle () {
      return this.enableMask ? {
        'mask-image': `url(${this.$store.state.config.logo})`
      } : {
        'background-color': this.enableMask ? '' : 'transparent'
      }
    },
    logoBgStyle () {
      return Object.assign({
        'margin': `${this.$store.state.config.logoMargin} 0`
      }, this.enableMask ? {} : {
        'background-color': this.enableMask ? '' : 'transparent'
      })
    },
    logo () { return this.$store.state.config.logo },
    style () { return { 'background-image': `url(${this.background})` } },
    sitename () { return this.$store.state.config.name },
    chat () { return this.$store.state.chat.channel.state === 'joined' },
    suggestionsEnabled () { return this.$store.state.config.suggestionsEnabled },
    showInstanceSpecificPanel () { return this.$store.state.config.showInstanceSpecificPanel }
  },
  methods: {
    activatePanel (panelName) {
      this.mobileActivePanel = panelName
    },
    scrollToTop () {
      window.scrollTo(0, 0)
    },
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
