import UserPanel from './components/user_panel/user_panel.vue'
import NavPanel from './components/nav_panel/nav_panel.vue'
import Notifications from './components/notifications/notifications.vue'
import UserFinder from './components/user_finder/user_finder.vue'

export default {
  name: 'app',
  components: {
    UserPanel,
    NavPanel,
    Notifications,
    UserFinder
  },
  data: () => ({
    mobileActivePanel: 'timeline'
  }),
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    background () {
      return this.currentUser.background_image || this.$store.state.config.background
    },
    logoStyle () { return { 'background-image': `url(${this.$store.state.config.logo})` } },
    style () { return { 'background-image': `url(${this.background})` } },
    sitename () { return this.$store.state.config.name }
  },
  created () {
    // this is to detect user zooming mostly
    window.addEventListener('resize', this.fixSidebarWidth)
  },
  mounted () {
    // for some reason, at least in dev mode, dom is not ready enough at this point
    // in theory calling the function directly here should be enough, but it's not
    setTimeout( () => { this.fixSidebarWidth() }, 500)
  },
  destroyed () {
    window.removeEventListener('resize', this.fixSidebarWidth)
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
    },
    fixSidebarWidth () {
      // firefox
      let barwidth = window.innerWidth - document.body.offsetWidth
      if (document.body.offsetWidth <= 0) {
        // chromium
        barwidth = window.innerWidth - document.body.scrollWidth
      }
      // adjust the sidebar size to fit the scrollbar width to keep the gap consistently sized
      document.getElementById("sidebar-container").style.width = `${345 + barwidth}px`
      document.getElementById("sidebar-container").style.paddingRight = `${barwidth}px`
    }
  }
}
