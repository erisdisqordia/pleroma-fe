const UserFinder = {
  data: () => ({
    username: undefined,
    hidden: true,
    error: false,
    loading: false
  }),
  methods: {
    findUser (username) {
      this.loading = true
      this.$store.state.api.backendInteractor.externalProfile(username)
        .then((user) => {
          this.loading = false
          this.hidden = true
          if (!user.error) {
            this.$store.commit('addNewUsers', [user])
            this.$router.push({name: 'user-profile', params: {id: user.id}})
          } else {
            this.error = true
          }
        })
    },
    toggleHidden () {
      this.hidden = !this.hidden
    },
    dismissError () {
      this.error = false
    }
  }
}

export default UserFinder
