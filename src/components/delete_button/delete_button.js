const DeleteButton = {
  props: [ 'status' ],
  methods: {
    deleteStatus () {
      const confirmed = confirm('Do you really want to delete this status?')
      if (confirmed) {
        this.$store.dispatch('deleteStatus', { id: this.status.id })
      }
    }
  },
  computed: {
    canDelete () { return this.status.user.rights.delete_others_notice || this.status.user.id == this.$store.state.users.currentUser.id }
  }
}

export default DeleteButton
