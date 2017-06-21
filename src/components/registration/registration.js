const registration = {
  data: () => ({
    user: {},
    error: false,
    registering: false
  }),
  created () {
    if (!this.$store.state.config.registrationOpen || !!this.$store.state.users.currentUser) {
      this.$router.push('/main/all')
    }
  },
  computed: {
    termsofservice () { return this.$store.state.config.tos }
  },
  methods: {
    submit () {
      this.registering = true
      this.user.nickname = this.user.username
      this.$store.state.api.backendInteractor.register(this.user).then(
        (response) => {
          if (response.ok) {
            this.$store.dispatch('loginUser', this.user)
            this.$router.push('/main/all')
            this.registering = false
          } else {
            this.registering = false
            response.json().then((data) => {
              this.error = data.error
            })
          }
        }
      )
    }
  }
}

export default registration
