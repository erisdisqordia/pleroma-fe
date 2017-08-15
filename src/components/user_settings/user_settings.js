import StyleSwitcher from '../style_switcher/style_switcher.vue'

const UserSettings = {
  data () {
    return {
      newname: this.$store.state.users.currentUser.name,
      newbio: this.$store.state.users.currentUser.description,
      previewavatar: null,
      previewbanner: null,
      previewbg: null,
      uploadingavatar: false,
      uploadingbanner: false,
      uploadingbg: false
    }
  },
  components: {
    StyleSwitcher
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    updateProfile () {
      const name = this.newname
      const description = this.newbio
      this.$store.state.api.backendInteractor.updateProfile({params: {name, description}}).then((user) => {
        if (!user.error) {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
        }
      })
    },
    uploadAvatar ({target}) {
      const file = target.files[0]
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result
        this.previewavatar = img
      }
      reader.readAsDataURL(file)
    },
    uploadBanner ({target}) {
      const file = target.files[0]
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result
        this.previewbanner = img
      }
      reader.readAsDataURL(file)
    },
    uploadBg ({target}) {
      const file = target.files[0]
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result
        this.previewbg = img
      }
      reader.readAsDataURL(file)
    },
    submitAvatar () {
      if (!this.previewavatar) { return }

      let img = this.previewavatar
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      let cropX, cropY, cropW, cropH
      imginfo.src = img
      if (imginfo.height > imginfo.width) {
        cropX = 0
        cropW = imginfo.width
        cropY = Math.floor((imginfo.height - imginfo.width) / 2)
        cropH = imginfo.width
      } else {
        cropY = 0
        cropH = imginfo.height
        cropX = Math.floor((imginfo.width - imginfo.height) / 2)
        cropW = imginfo.height
      }
      this.uploadingavatar = true
      this.$store.state.api.backendInteractor.updateAvatar({params: {img, cropX, cropY, cropW, cropH}}).then((user) => {
        if (!user.error) {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
          this.previewavatar = null
        }
        this.uploadingavatar = false
      })
    },
    submitBanner () {
      if (!this.previewbanner) { return }

      let banner = this.previewbanner
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      /* eslint-disable camelcase */
      let offset_top, offset_left, width, height
      imginfo.src = banner
      width = imginfo.width
      height = imginfo.height
      offset_top = 0
      offset_left = 0
      this.uploadingbanner = true
      this.$store.state.api.backendInteractor.updateBanner({params: {banner, offset_top, offset_left, width, height}}).then((data) => {
        if (!data.error) {
          let clone = JSON.parse(JSON.stringify(this.$store.state.users.currentUser))
          clone.cover_photo = data.url
          this.$store.commit('addNewUsers', [clone])
          this.$store.commit('setCurrentUser', clone)
          this.previewbanner = null
        }
        this.uploadingbanner = false
      })
      /* eslint-enable camelcase */
    },
    submitBg () {
      if (!this.previewbg) { return }
      let img = this.previewbg
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      let cropX, cropY, cropW, cropH
      imginfo.src = img
      cropX = 0
      cropY = 0
      cropW = imginfo.width
      cropH = imginfo.width
      this.uploadingbg = true
      this.$store.state.api.backendInteractor.updateBg({params: {img, cropX, cropY, cropW, cropH}}).then((data) => {
        if (!data.error) {
          let clone = JSON.parse(JSON.stringify(this.$store.state.users.currentUser))
          clone.background_image = data.url
          this.$store.commit('addNewUsers', [clone])
          this.$store.commit('setCurrentUser', clone)
          this.previewbg = null
        }
        this.uploadingbg = false
      })
    }
  },
  watch: {
  }
}

export default UserSettings
