import Popper from 'vue-popperjs/src/component/popper.js.vue'

const ExtraButtons = {
  props: [ 'status' ],
  components: {
    Popper
  },
  data () {
    return {
      showDropDown: false
    }
  },
  methods: {
    deleteStatus () {
      const confirmed = window.confirm(this.$t('status.delete_confirm'))
      if (confirmed) {
        this.$store.dispatch('deleteStatus', { id: this.status.id })
      }
    },
    toggleMenu () {
      this.showDropDown = !this.showDropDown
    },
    pinStatus () {
      this.$store.state.api.backendInteractor.pinOwnStatus(this.status.id).then((status) => {
        if (status.error) {
          this.$emit('onError', status.error)
        } else {
          this.$store.dispatch('updatePinned', status)
        }
      })
    },
    unpinStatus () {
      this.$store.state.api.backendInteractor.unpinOwnStatus(this.status.id).then((status) => {
        this.$store.dispatch('updatePinned', status)
      })
    }
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    canDelete () {
      if (!this.currentUser) { return }
      const superuser = this.currentUser.rights.moderator || this.currentUser.rights.admin
      return superuser || this.status.user.id === this.currentUser.id
    },
    ownStatus () {
      return this.status.user.id === this.currentUser.id
    },
    canPin () {
      return this.ownStatus && (this.status.visibility === 'public' || this.status.visibility === 'unlisted')
    }
  }
}

export default ExtraButtons
