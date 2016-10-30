const LoginForm = {
  data: () => ({
    user: {}
  }),
  computed: {
    loggingIn () { return this.$store.state.users.loggingIn }
  },
  methods: {
    submit () {
      this.$store.dispatch('loginUser', this.user).then(() => {
        this.$router.push('/main/friends')
      })
    }
  }
}

export default LoginForm
