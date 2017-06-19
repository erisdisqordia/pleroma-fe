const UserFinder = {
  data: () => ({
    username: undefined,
    hidden: true
  }),
  methods: {
    findUser (username) {
      this.$store.state.api.backendInteractor.externalProfile(username)
        .then((user) => {
          if (!user.error) {
            this.$store.commit('addNewUsers', [user])
            this.$router.push({name: 'user-profile', params: {id: user.id}})
          }
        })
    },
    toggleHidden () {
      this.hidden = !this.hidden
    }
  }
}

export default UserFinder
