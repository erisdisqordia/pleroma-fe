import TabSwitcher from '../tab_switcher/tab_switcher.jsx'
import StyleSwitcher from '../style_switcher/style_switcher.vue'

const UserSettings = {
  data () {
    return {
      newname: this.$store.state.users.currentUser.name,
      newbio: this.$store.state.users.currentUser.description,
      newlocked: this.$store.state.users.currentUser.locked,
      newnorichtext: this.$store.state.users.currentUser.no_rich_text,
      newdefaultScope: this.$store.state.users.currentUser.default_scope,
      followList: null,
      followImportError: false,
      followsImported: false,
      enableFollowsExport: true,
      uploading: [ false, false, false, false ],
      previews: [ null, null, null ],
      deletingAccount: false,
      deleteAccountConfirmPasswordInput: '',
      deleteAccountError: false,
      changePasswordInputs: [ '', '', '' ],
      changedPassword: false,
      changePasswordError: false,
      activeTab: 'profile'
    }
  },
  components: {
    StyleSwitcher,
    TabSwitcher
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    pleromaBackend () {
      return this.$store.state.instance.pleromaBackend
    },
    scopeOptionsEnabled () {
      return this.$store.state.instance.scopeOptionsEnabled
    },
    vis () {
      return {
        public: { selected: this.newdefaultScope === 'public' },
        unlisted: { selected: this.newdefaultScope === 'unlisted' },
        private: { selected: this.newdefaultScope === 'private' },
        direct: { selected: this.newdefaultScope === 'direct' }
      }
    }
  },
  methods: {
    updateProfile () {
      const name = this.newname
      const description = this.newbio
      const locked = this.newlocked
      /* eslint-disable camelcase */
      const default_scope = this.newdefaultScope
      const no_rich_text = this.newnorichtext
      this.$store.state.api.backendInteractor.updateProfile({params: {name, description, locked, default_scope, no_rich_text}}).then((user) => {
        if (!user.error) {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
        }
      })
      /* eslint-enable camelcase */
    },
    changeVis (visibility) {
      this.newdefaultScope = visibility
    },
    uploadFile (slot, e) {
      const file = e.target.files[0]
      if (!file) { return }
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result
        this.previews[slot] = img
        this.$forceUpdate() // just changing the array with the index doesn't update the view
      }
      reader.readAsDataURL(file)
    },
    submitAvatar () {
      if (!this.previews[0]) { return }

      let img = this.previews[0]
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
      this.uploading[0] = true
      this.$store.state.api.backendInteractor.updateAvatar({params: {img, cropX, cropY, cropW, cropH}}).then((user) => {
        if (!user.error) {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
          this.previews[0] = null
        }
        this.uploading[0] = false
      })
    },
    submitBanner () {
      if (!this.previews[1]) { return }

      let banner = this.previews[1]
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      /* eslint-disable camelcase */
      let offset_top, offset_left, width, height
      imginfo.src = banner
      width = imginfo.width
      height = imginfo.height
      offset_top = 0
      offset_left = 0
      this.uploading[1] = true
      this.$store.state.api.backendInteractor.updateBanner({params: {banner, offset_top, offset_left, width, height}}).then((data) => {
        if (!data.error) {
          let clone = JSON.parse(JSON.stringify(this.$store.state.users.currentUser))
          clone.cover_photo = data.url
          this.$store.commit('addNewUsers', [clone])
          this.$store.commit('setCurrentUser', clone)
          this.previews[1] = null
        }
        this.uploading[1] = false
      })
      /* eslint-enable camelcase */
    },
    submitBg () {
      if (!this.previews[2]) { return }
      let img = this.previews[2]
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      let cropX, cropY, cropW, cropH
      imginfo.src = img
      cropX = 0
      cropY = 0
      cropW = imginfo.width
      cropH = imginfo.width
      this.uploading[2] = true
      this.$store.state.api.backendInteractor.updateBg({params: {img, cropX, cropY, cropW, cropH}}).then((data) => {
        if (!data.error) {
          let clone = JSON.parse(JSON.stringify(this.$store.state.users.currentUser))
          clone.background_image = data.url
          this.$store.commit('addNewUsers', [clone])
          this.$store.commit('setCurrentUser', clone)
          this.previews[2] = null
        }
        this.uploading[2] = false
      })
    },
    importFollows () {
      this.uploading[3] = true
      const followList = this.followList
      this.$store.state.api.backendInteractor.followImport({params: followList})
        .then((status) => {
          if (status) {
            this.followsImported = true
          } else {
            this.followImportError = true
          }
          this.uploading[3] = false
        })
    },
    /* This function takes an Array of Users
     * and outputs a file with all the addresses for the user to download
     */
    exportPeople (users, filename) {
      // Get all the friends addresses
      var UserAddresses = users.map(function (user) {
        // check is it's a local user
        if (user && user.is_local) {
          // append the instance address
          // eslint-disable-next-line no-undef
          user.screen_name += '@' + location.hostname
        }
        return user.screen_name
      }).join('\n')
      // Make the user download the file
      var fileToDownload = document.createElement('a')
      fileToDownload.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(UserAddresses))
      fileToDownload.setAttribute('download', filename)
      fileToDownload.style.display = 'none'
      document.body.appendChild(fileToDownload)
      fileToDownload.click()
      document.body.removeChild(fileToDownload)
    },
    exportFollows () {
      this.enableFollowsExport = false
      this.$store.state.api.backendInteractor
        .fetchFriends({id: this.$store.state.users.currentUser.id})
        .then((friendList) => {
          this.exportPeople(friendList, 'friends.csv')
        })
    },
    followListChange () {
      // eslint-disable-next-line no-undef
      let formData = new FormData()
      formData.append('list', this.$refs.followlist.files[0])
      this.followList = formData
    },
    dismissImported () {
      this.followsImported = false
      this.followImportError = false
    },
    confirmDelete () {
      this.deletingAccount = true
    },
    deleteAccount () {
      this.$store.state.api.backendInteractor.deleteAccount({password: this.deleteAccountConfirmPasswordInput})
        .then((res) => {
          if (res.status === 'success') {
            this.$store.dispatch('logout')
            this.$router.push('/main/all')
          } else {
            this.deleteAccountError = res.error
          }
        })
    },
    changePassword () {
      const params = {
        password: this.changePasswordInputs[0],
        newPassword: this.changePasswordInputs[1],
        newPasswordConfirmation: this.changePasswordInputs[2]
      }
      this.$store.state.api.backendInteractor.changePassword(params)
        .then((res) => {
          if (res.status === 'success') {
            this.changedPassword = true
            this.changePasswordError = false
          } else {
            this.changedPassword = false
            this.changePasswordError = res.error
          }
        })
    },
    activateTab (tabName) {
      this.activeTab = tabName
    }
  }
}

export default UserSettings
