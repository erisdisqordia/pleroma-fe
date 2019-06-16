import Popper from 'vue-popperjs/src/component/popper.js.vue'

const ExtraButtons = {
  props: [ 'status' ],
  components: {
    Popper
  },
  data () {
    return {
      showDropDown: false,
      showPopper: true
    }
  },
  methods: {
    deleteStatus () {
      this.refreshPopper()
      const confirmed = window.confirm(this.$t('status.delete_confirm'))
      if (confirmed) {
        this.$store.dispatch('deleteStatus', { id: this.status.id })
      }
    },
    toggleMenu () {
      this.showDropDown = !this.showDropDown
    },
    pinStatus () {
      this.refreshPopper()
      this.$store.dispatch('pinStatus', this.status.id)
        .then(() => this.$emit('onSuccess'))
        .catch(err => this.$emit('onError', err.error.error))
    },
    unpinStatus () {
      this.refreshPopper()
      this.$store.dispatch('unpinStatus', this.status.id)
        .then(() => this.$emit('onSuccess'))
        .catch(err => this.$emit('onError', err.error.error))
    },
    refreshPopper () {
      this.showPopper = false
      this.showDropDown = false
      setTimeout(() => {
        this.showPopper = true
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
    },
    enabled () {
      return this.canPin || this.canDelete
    }
  }
}

export default ExtraButtons
