const RemoteUserResolver = {
  data: () => ({
    error: false
  }),
  mounted () {
    this.redirect()
  },
  methods: {
    redirect () {
      const acct = this.$route.params.username + '@' + this.$route.params.hostname
      this.$store.state.api.backendInteractor.fetchUser({ id: acct })
        .then((externalUser) => {
          if (externalUser.error) {
            this.error = true
          } else {
            this.$store.commit('addNewUsers', [externalUser])
            const id = externalUser.id
            this.$router.replace({
              name: 'external-user-profile',
              params: { id }
            })
          }
        })
        .catch(() => {
          this.error = true
        })
    }
  }
}

export default RemoteUserResolver
