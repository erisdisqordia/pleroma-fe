import oauthApi from '../../services/new_api/oauth.js'
const LoginForm = {
  data: () => ({
    user: {},
    authError: false
  }),
  computed: {
    loginMethod () { return this.$store.state.instance.loginMethod },
    loggingIn () { return this.$store.state.users.loggingIn },
    registrationOpen () { return this.$store.state.instance.registrationOpen }
  },
  methods: {
    oAuthLogin () {
      const { clientId } = this.$store.state.oauth
      const data = {
        clientId,
        instance: this.$store.state.instance.server,
        commit: this.$store.commit
      }

      oauthApi.getOrCreateApp(data)
        .then((app) => { oauthApi.login({ ...app, ...data }) })
    },
    submit () {
      const { clientId } = this.$store.state.oauth
      const data = {
        clientId,
        instance: this.$store.state.instance.server,
        commit: this.$store.commit
      }
      this.clearError()
      oauthApi.getOrCreateApp(data).then((app) => {
        oauthApi.getTokenWithCredentials(
          {
            ...app,
            instance: data.instance,
            username: this.user.username,
            password: this.user.password
          }
        ).then(async (result) => {
          if (result.error) {
            this.authError = result.error
            this.user.password = ''
            return
          }
          this.$store.commit('setToken', result.access_token)
          try {
            await this.$store.dispatch('loginUser', result.access_token)
            this.$router.push({name: 'friends'})
          } catch (e) {
            console.log(e)
          }
        })
      })
    },
    clearError () {
      this.authError = false
    }
  }
}

export default LoginForm
