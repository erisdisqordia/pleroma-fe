const LoginForm = {
  data: () => ({
    user: {},
    authError: false
  }),
  computed: {
    loggingIn () { return this.$store.state.users.loggingIn },
    registrationOpen () { return this.$store.state.instance.registrationOpen }
  },
  methods: {
    submit () {
      this.$store.dispatch('loginUser', this.user).then(
        () => {},
        (error) => {
          this.authError = error
          this.user.username = ''
          this.user.password = ''
        }
      )
    }
  }
}

export default LoginForm
