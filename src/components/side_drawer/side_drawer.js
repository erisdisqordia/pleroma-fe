import UserCardContent from '../user_card_content/user_card_content.vue'

const deltaX = (oldX, newX) => newX - oldX

const touchEventX = e => e.touches[0].screenX

const SideDrawer = {
  props: [ 'activatePanel', 'logout' ],
  data: () => ({
    closed: true,
    touchX: 0
  }),
  components: { UserCardContent },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    toggleDrawer () {
      this.closed = !this.closed
    },
    gotoPanel (panel) {
      this.activatePanel(panel)
      this.toggleDrawer()
    },
    doLogout () {
      this.logout()
      this.gotoPanel('timeline')
    },
    touchStart (e) {
      this.touchX = touchEventX(e)
    },
    touchMove (e) {
      const delta = deltaX(this.touchX, touchEventX(e))
      if (delta < -30 && !this.closed) {
        this.toggleDrawer()
      }
    }
  }
}

export default SideDrawer
