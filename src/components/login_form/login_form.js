const LoginForm = {
  data: () => ({
    user: {},
    authError: false
  }),
  computed: {
    loggingIn () { return this.$store.state.users.loggingIn }
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
