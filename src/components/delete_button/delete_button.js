const DeleteButton = {
  props: [ 'status' ],
  methods: {
    deleteStatus () {
      const confirmed = window.confirm('Do you really want to delete this status?')
      if (confirmed) {
        this.$store.dispatch('deleteStatus', { id: this.status.id })
      }
    }
  },
  computed: {
    currentUser () { return this.$store.state.users.currentUser },
    canDelete () { return this.currentUser && this.currentUser.rights.delete_others_notice || this.status.user.id === this.currentUser.id }
  }
}

export default DeleteButton
