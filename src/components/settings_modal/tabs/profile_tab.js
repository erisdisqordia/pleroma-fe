import unescape from 'lodash/unescape'
import ImageCropper from 'src/components/image_cropper/image_cropper.vue'
import ScopeSelector from 'src/components/scope_selector/scope_selector.vue'
import fileSizeFormatService from 'src/components/../services/file_size_format/file_size_format.js'
import ProgressButton from 'src/components/progress_button/progress_button.vue'
import EmojiInput from 'src/components/emoji_input/emoji_input.vue'
import suggestor from 'src/components/emoji_input/suggestor.js'
import Autosuggest from 'src/components/autosuggest/autosuggest.vue'
import Checkbox from 'src/components/checkbox/checkbox.vue'

const ProfileTab = {
  data () {
    return {
      newName: this.$store.state.users.currentUser.name,
      newBio: unescape(this.$store.state.users.currentUser.description),
      newLocked: this.$store.state.users.currentUser.locked,
      newNoRichText: this.$store.state.users.currentUser.no_rich_text,
      newDefaultScope: this.$store.state.users.currentUser.default_scope,
      hideFollows: this.$store.state.users.currentUser.hide_follows,
      hideFollowers: this.$store.state.users.currentUser.hide_followers,
      hideFollowsCount: this.$store.state.users.currentUser.hide_follows_count,
      hideFollowersCount: this.$store.state.users.currentUser.hide_followers_count,
      showRole: this.$store.state.users.currentUser.show_role,
      role: this.$store.state.users.currentUser.role,
      discoverable: this.$store.state.users.currentUser.discoverable,
      allowFollowingMove: this.$store.state.users.currentUser.allow_following_move,
      pickAvatarBtnVisible: true,
      bannerUploading: false,
      backgroundUploading: false,
      banner: null,
      bannerPreview: null,
      background: null,
      backgroundPreview: null,
      bannerUploadError: null,
      backgroundUploadError: null
    }
  },
  components: {
    ScopeSelector,
    ImageCropper,
    EmojiInput,
    Autosuggest,
    ProgressButton,
    Checkbox
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    emojiUserSuggestor () {
      return suggestor({
        emoji: [
          ...this.$store.state.instance.emoji,
          ...this.$store.state.instance.customEmoji
        ],
        users: this.$store.state.users.users,
        updateUsersList: (query) => this.$store.dispatch('searchUsers', { query })
      })
    },
    emojiSuggestor () {
      return suggestor({ emoji: [
        ...this.$store.state.instance.emoji,
        ...this.$store.state.instance.customEmoji
      ] })
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
            discoverable: this.discoverable,
            allow_following_move: this.allowFollowingMove,
            hide_follows_count: this.hideFollowsCount,
            hide_followers_count: this.hideFollowersCount,
            show_role: this.showRole
            /* eslint-enable camelcase */
          } }).then((user) => {
          this.$store.commit('addNewUsers', [user])
          this.$store.commit('setCurrentUser', user)
        })
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
        this[slot + 'UploadError'] = [
          this.$t('upload.error.base'),
          this.$t(
            'upload.error.file_too_big',
            {
              filesize: filesize.num,
              filesizeunit: filesize.unit,
              allowedsize: allowedsize.num,
              allowedsizeunit: allowedsize.unit
            }
          )
        ].join(' ')
        return
      }
      // eslint-disable-next-line no-undef
      const reader = new FileReader()
      reader.onload = ({ target }) => {
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
    submitBanner () {
      if (!this.bannerPreview) { return }

      this.bannerUploading = true
      this.$store.state.api.backendInteractor.updateBanner({ banner: this.banner })
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
      let background = this.background
      this.backgroundUploading = true
      this.$store.state.api.backendInteractor.updateBg({ background }).then((data) => {
        if (!data.error) {
          this.$store.commit('addNewUsers', [data])
          this.$store.commit('setCurrentUser', data)
          this.backgroundPreview = null
        } else {
          this.backgroundUploadError = this.$t('upload.error.base') + data.error
        }
        this.backgroundUploading = false
      })
    }
  }
}

export default ProfileTab
