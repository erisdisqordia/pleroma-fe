import DialogModal from '../dialog_modal/dialog_modal.vue'

const FORCE_NSFW = 'mrf_tag:media-force-nsfw'
const STRIP_MEDIA = 'mrf_tag:media-strip'
const FORCE_UNLISTED = 'mrf_tag:force-unlisted'
const DISABLE_REMOTE_SUBSCRIPTION = 'mrf_tag:disable-remote-subscription'
const DISABLE_ANY_SUBSCRIPTION = 'mrf_tag:disable-any-subscription'
const SANDBOX = 'mrf_tag:sandbox'
const QUARANTINE = 'mrf_tag:quarantine'

const ModerationTools = {
  props: [
    'user'
  ],
  data () {
    return {
      showDropDown: false,
      tags: {
        FORCE_NSFW,
        STRIP_MEDIA,
        FORCE_UNLISTED,
        DISABLE_REMOTE_SUBSCRIPTION,
        DISABLE_ANY_SUBSCRIPTION,
        SANDBOX,
        QUARANTINE
      },
      showDeleteUserDialog: false
    }
  },
  components: {
    DialogModal
  },
  computed: {
    tagsSet () {
      return new Set(this.user.tags)
    },
    hasTagPolicy () {
      return this.$store.state.instance.tagPolicyAvailable
    }
  },
  methods: {
    hasTag (tagName) {
      return this.tagsSet.has(tagName)
    },
    toggleTag (tag) {
      const store = this.$store
      if (this.tagsSet.has(tag)) {
        store.state.api.backendInteractor.untagUser({ user: this.user, tag }).then(response => {
          if (!response.ok) { return }
          store.commit('untagUser', { user: this.user, tag })
        })
      } else {
        store.state.api.backendInteractor.tagUser({ user: this.user, tag }).then(response => {
          if (!response.ok) { return }
          store.commit('tagUser', { user: this.user, tag })
        })
      }
    },
    toggleRight (right) {
      const store = this.$store
      if (this.user.rights[right]) {
        store.state.api.backendInteractor.deleteRight({ user: this.user, right }).then(response => {
          if (!response.ok) { return }
          store.commit('updateRight', { user: this.user, right, value: false })
        })
      } else {
        store.state.api.backendInteractor.addRight({ user: this.user, right }).then(response => {
          if (!response.ok) { return }
          store.commit('updateRight', { user: this.user, right, value: true })
        })
      }
    },
    toggleActivationStatus () {
      this.$store.dispatch('toggleActivationStatus', { user: this.user })
    },
    deleteUserDialog (show) {
      this.showDeleteUserDialog = show
    },
    deleteUser () {
      const store = this.$store
      const user = this.user
      const { id, name } = user
      store.state.api.backendInteractor.deleteUser({ user })
        .then(e => {
          this.$store.dispatch('markStatusesAsDeleted', status => user.id === status.user.id)
          const isProfile = this.$route.name === 'external-user-profile' || this.$route.name === 'user-profile'
          const isTargetUser = this.$route.params.name === name || this.$route.params.id === id
          if (isProfile && isTargetUser) {
            window.history.back()
          }
        })
    }
  }
}

export default ModerationTools
