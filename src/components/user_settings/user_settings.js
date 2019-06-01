import unescape from 'lodash/unescape'
import get from 'lodash/get'
import map from 'lodash/map'
import reject from 'lodash/reject'
import TabSwitcher from '../tab_switcher/tab_switcher.js'
import ImageCropper from '../image_cropper/image_cropper.vue'
import StyleSwitcher from '../style_switcher/style_switcher.vue'
import ScopeSelector from '../scope_selector/scope_selector.vue'
import fileSizeFormatService from '../../services/file_size_format/file_size_format.js'
import BlockCard from '../block_card/block_card.vue'
import MuteCard from '../mute_card/mute_card.vue'
import SelectableList from '../selectable_list/selectable_list.vue'
import ProgressButton from '../progress_button/progress_button.vue'
import EmojiInput from '../emoji-input/emoji-input.vue'
import Autosuggest from '../autosuggest/autosuggest.vue'
import Importer from '../importer/importer.vue'
import Exporter from '../exporter/exporter.vue'
import withSubscription from '../../hocs/with_subscription/with_subscription'
import userSearchApi from '../../services/new_api/user_search.js'

const BlockList = withSubscription({
  fetch: (props, $store) => $store.dispatch('fetchBlocks'),
  select: (props, $store) => get($store.state.users.currentUser, 'blockIds', []),
  childPropName: 'items'
})(SelectableList)

const MuteList = withSubscription({
  fetch: (props, $store) => $store.dispatch('fetchMutes'),
  select: (props, $store) => get($store.state.users.currentUser, 'muteIds', []),
  childPropName: 'items'
})(SelectableList)

const UserSettings = {
  data () {
    return {
      newName: this.$store.state.users.currentUser.name,
      newBio: unescape(this.$store.state.users.currentUser.description),
      newLocked: this.$store.state.users.currentUser.locked,
      newNoRichText: this.$store.state.users.currentUser.no_rich_text,
      newDefaultScope: this.$store.state.users.currentUser.default_scope,
      hideFollows: this.$store.state.users.currentUser.hide_follows,
      hideFollowers: this.$store.state.users.currentUser.hide_followers,
      showRole: this.$store.state.users.currentUser.show_role,
      role: this.$store.state.users.currentUser.role,
      pickAvatarBtnVisible: true,
      bannerUploading: false,
      backgroundUploading: false,
      bannerPreview: null,
      backgroundPreview: null,
      bannerUploadError: null,
      backgroundUploadError: null,
      deletingAccount: false,
      deleteAccountConfirmPasswordInput: '',
      deleteAccountError: false,
      changePasswordInputs: [ '', '', '' ],
      changedPassword: false,
      changePasswordError: false,
      activeTab: 'profile',
      notificationSettings: this.$store.state.users.currentUser.notification_settings
    }
  },
  created () {
    this.$store.dispatch('fetchTokens')
  },
  components: {
    StyleSwitcher,
    ScopeSelector,
    TabSwitcher,
    ImageCropper,
    BlockList,
    MuteList,
    EmojiInput,
    Autosuggest,
    BlockCard,
    MuteCard,
    ProgressButton,
    Importer,
    Exporter
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    pleromaBackend () {
      return this.$store.state.instance.pleromaBackend
    },
    minimalScopesMode () {
      return this.$store.state.instance.minimalScopesMode
    },
    vis () {
      return {
        public: { selected: this.newDefaultScope === 'public' },
        unlisted: { selected: this.newDefaultScope === 'unlisted' },
        private: { selected: this.newDefaultScope === 'private' },
        direct: { selected: this.newDefaultScope === 'direct' }
      }
    },
    currentSaveStateNotice () {
      return this.$store.state.interface.settings.currentSaveStateNotice
    },
    oauthTokens () {
      return this.$store.state.oauthTokens.tokens.map(oauthToken => {
        return {
          id: oauthToken.id,
          appName: oauthToken.app_name,
          validUntil: new Date(oauthToken.valid_until).toLocaleDateString()
        }
      })
    }
  },
  methods: {
    updateProfile () {
      this.$store.state.api.backendInteractor
        .updateProfile({
          params: {
            note: this.newBio,
            locked: this.newLocked,
            // Backend notation.
            /* eslint-disable camelcase */
            display_name: this.newName,
            default_scope: this.newDefaultScope,
            no_rich_text: this.newNoRichText,
            hide_follows: this.hideFollows,
            hide_followers: this.hideFollowers,
            show_role: this.showRole
            /* eslint-enable camelcase */
          }}).then((user) => {
            this.$store.commit('addNewUsers', [user])
            this.$store.commit('setCurrentUser', user)
          })
    },
    updateNotificationSettings () {
      this.$store.state.api.backendInteractor
        .updateNotificationSettings({ settings: this.notificationSettings })
    },
    changeVis (visibility) {
      this.newDefaultScope = visibility
    },
    uploadFile (slot, e) {
      const file = e.target.files[0]
      if (!file) { return }
      if (file.size > this.$store.state.instance[slot + 'limit']) {
        const filesize = fileSizeFormatService.fileSizeFormat(file.size)
        const allowedsize = fileSizeFormatService.fileSizeFormat(this.$store.state.instance[slot + 'limit'])
        this[slot + 'UploadError'] = this.$t('upload.error.base') + ' ' + this.$t('upload.error.file_too_big', {filesize: filesize.num, filesizeunit: filesize.unit, allowedsize: allowedsize.num, allowedsizeunit: allowedsize.unit})
        return
      }
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({target}) => {
        const img = target.result
        this[slot + 'Preview'] = img
        this[slot] = file
      }
      reader.readAsDataURL(file)
    },
    submitAvatar (cropper, file) {
      const that = this
      return new Promise((resolve, reject) => {
        function updateAvatar (avatar) {
          that.$store.state.api.backendInteractor.updateAvatar({ avatar })
            .then((user) => {
              that.$store.commit('addNewUsers', [user])
              that.$store.commit('setCurrentUser', user)
              resolve()
            })
            .catch((err) => {
              reject(new Error(that.$t('upload.error.base') + ' ' + err.message))
            })
        }

        if (cropper) {
          cropper.getCroppedCanvas().toBlob(updateAvatar, file.type)
        } else {
          updateAvatar(file)
        }
      })
    },
    clearUploadError (slot) {
      this[slot + 'UploadError'] = null
    },
    submitBanner () {
      if (!this.bannerPreview) { return }

      this.bannerUploading = true
      this.$store.state.api.backendInteractor.updateBanner({banner: this.banner})
        .then((user) => {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
          this.bannerPreview = null
        })
        .catch((err) => {
          this.bannerUploadError = this.$t('upload.error.base') + ' ' + err.message
        })
        .then(() => { this.bannerUploading = false })
    },
    submitBg () {
      if (!this.backgroundPreview) { return }
      let img = this.backgroundPreview
      // eslint-disable-next-line no-undef
      let imginfo = new Image()
      let cropX, cropY, cropW, cropH
      imginfo.src = img
      cropX = 0
      cropY = 0
      cropW = imginfo.width
      cropH = imginfo.width
      this.backgroundUploading = true
      this.$store.state.api.backendInteractor.updateBg({params: {img, cropX, cropY, cropW, cropH}}).then((data) => {
        if (!data.error) {
          let clone = JSON.parse(JSON.stringify(this.$store.state.users.currentUser))
          clone.background_image = data.url
          this.$store.commit('addNewUsers', [clone])
          this.$store.commit('setCurrentUser', clone)
          this.backgroundPreview = null
        } else {
          this.backgroundUploadError = this.$t('upload.error.base') + data.error
        }
        this.backgroundUploading = false
      })
    },
    importFollows (file) {
      return this.$store.state.api.backendInteractor.importFollows(file)
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    importBlocks (file) {
      return this.$store.state.api.backendInteractor.importBlocks(file)
        .then((status) => {
          if (!status) {
            throw new Error('failed')
          }
        })
    },
    generateExportableUsersContent (users) {
      // Get addresses
      return users.map((user) => {
        // check is it's a local user
        if (user && user.is_local) {
          // append the instance address
          // eslint-disable-next-line no-undef
          return user.screen_name + '@' + location.hostname
        }
        return user.screen_name
      }).join('\n')
    },
    getFollowsContent () {
      return this.$store.state.api.backendInteractor.exportFriends({ id: this.$store.state.users.currentUser.id })
        .then(this.generateExportableUsersContent)
    },
    getBlocksContent () {
      return this.$store.state.api.backendInteractor.fetchBlocks()
        .then(this.generateExportableUsersContent)
    },
    confirmDelete () {
      this.deletingAccount = true
    },
    deleteAccount () {
      this.$store.state.api.backendInteractor.deleteAccount({password: this.deleteAccountConfirmPasswordInput})
        .then((res) => {
          if (res.status === 'success') {
            this.$store.dispatch('logout')
            this.$router.push({name: 'root'})
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
            this.logout()
          } else {
            this.changedPassword = false
            this.changePasswordError = res.error
          }
        })
    },
    activateTab (tabName) {
      this.activeTab = tabName
    },
    logout () {
      this.$store.dispatch('logout')
      this.$router.replace('/')
    },
    revokeToken (id) {
      if (window.confirm(`${this.$i18n.t('settings.revoke_token')}?`)) {
        this.$store.dispatch('revokeToken', id)
      }
    },
    filterUnblockedUsers (userIds) {
      return reject(userIds, (userId) => {
        const user = this.$store.getters.findUser(userId)
        return !user || user.statusnet_blocking || user.id === this.$store.state.users.currentUser.id
      })
    },
    filterUnMutedUsers (userIds) {
      return reject(userIds, (userId) => {
        const user = this.$store.getters.findUser(userId)
        return !user || user.muted || user.id === this.$store.state.users.currentUser.id
      })
    },
    queryUserIds (query) {
      return userSearchApi.search({query, store: this.$store})
        .then((users) => {
          this.$store.dispatch('addNewUsers', users)
          return map(users, 'id')
        })
    },
    blockUsers (ids) {
      return this.$store.dispatch('blockUsers', ids)
    },
    unblockUsers (ids) {
      return this.$store.dispatch('unblockUsers', ids)
    },
    muteUsers (ids) {
      return this.$store.dispatch('muteUsers', ids)
    },
    unmuteUsers (ids) {
      return this.$store.dispatch('unmuteUsers', ids)
    },
    identity (value) {
      return value
    }
  }
}

export default UserSettings
