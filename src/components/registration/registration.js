const registration = {
  data: () => ({
    user: {},
    error: false,
    registering: false
  }),
  created () {
    if ((!this.$store.state.config.registrationOpen && !this.token) || !!this.$store.state.users.currentUser) {
      this.$router.push('/main/all')
    }
    // Seems like this doesn't work at first page open for some reason
    if (this.$store.state.config.registrationOpen && this.token) {
      this.$router.push('/registration')
    }
  },
  computed: {
    termsofservice () { return this.$store.state.config.tos },
    token () { return this.$route.params.token }
  },
  methods: {
    submit () {
      this.registering = true
      this.user.nickname = this.user.username
      this.user.token = this.token
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
