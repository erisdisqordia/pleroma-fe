const UserFinder = {
  data: () => ({
    username: undefined
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
    }
  }
}

export default UserFinder
