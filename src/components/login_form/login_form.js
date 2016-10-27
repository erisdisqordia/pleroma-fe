const LoginForm = {
  data: () => ({
    user: {}
  }),
  computed: {
    loggingIn () { return this.$store.state.users.loggingIn }
  },
  methods: {
    submit () {
      this.$store.dispatch('loginUser', this.user)
    }
  }
}

export default LoginForm
