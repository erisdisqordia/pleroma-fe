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
        () => { this.$router.push('/main/friends')}, 
        () => { this.authError = true }
      )
    }
  }
}

export default LoginForm
