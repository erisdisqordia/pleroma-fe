
const GlobalNoticeList = {
  computed: {
    notices () {
      return this.$store.state.interface.globalNotices
    }
  },
  methods: {
    closeNotice (notice) {
      this.$store.dispatch('removeGlobalNotice', notice)
    }
  }
}

export default GlobalNoticeList
