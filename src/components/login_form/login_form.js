import oauthApi from "../../services/new_api/oauth.js";
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
    oAuthLogin () {
      oauthApi.login({
        oauth: this.$store.state.oauth,
        instance: this.$store.state.instance.server,
        commit: this.$store.commit
      });
    },
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
