import oauthApi from '../../services/new_api/oauth.js'

const registration = {
  data: () => ({
    user: {},
    error: false,
    registering: false
  }),
  created () {
    if ((!this.$store.state.instance.registrationOpen && !this.token) || !!this.$store.state.users.currentUser) {
      this.$router.push('/main/all')
    }
    // Seems like this doesn't work at first page open for some reason
    if (this.$store.state.instance.registrationOpen && this.token) {
      this.$router.push('/registration')
    }
  },
  computed: {
    termsofservice () { return this.$store.state.instance.tos },
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
            const data = {
              oauth: this.$store.state.oauth,
              instance: this.$store.state.instance.server
            }
            oauthApi.getOrCreateApp(data).then((app) => {
              oauthApi.getTokenWithCredentials(
                {app,
                 instance: data.instance,
                 username: this.user.username,
                 password: this.user.password})
                .then((result) => {
                  this.$store.commit('setToken', result.access_token)
                  this.$store.dispatch('loginUser', result.access_token)
                  this.$router.push('/main/friends')
                })
            })
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
