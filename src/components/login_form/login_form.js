import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import oauthApi from '../../services/new_api/oauth.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes
)

const LoginForm = {
  data: () => ({
    user: {},
    error: false
  }),
  computed: {
    isPasswordAuth () { return this.requiredPassword },
    isTokenAuth () { return this.requiredToken },
    ...mapState({
      registrationOpen: state => state.instance.registrationOpen,
      instance: state => state.instance,
      loggingIn: state => state.users.loggingIn,
      oauth: state => state.oauth
    }),
    ...mapGetters(
      'authFlow', ['requiredPassword', 'requiredToken', 'requiredMFA']
    )
  },
  methods: {
    ...mapMutations('authFlow', ['requireMFA']),
    ...mapActions({ login: 'authFlow/login' }),
    submit () {
      this.isTokenAuth ? this.submitToken() : this.submitPassword()
    },
    submitToken () {
      const { clientId, clientSecret } = this.oauth
      const data = {
        clientId,
        clientSecret,
        instance: this.instance.server,
        commit: this.$store.commit
      }

      oauthApi.getOrCreateApp(data)
        .then((app) => { oauthApi.login({ ...app, ...data }) })
    },
    submitPassword () {
      const { clientId } = this.oauth
      const data = {
        clientId,
        oauth: this.oauth,
        instance: this.instance.server,
        commit: this.$store.commit
      }
      this.error = false

      oauthApi.getOrCreateApp(data).then((app) => {
        oauthApi.getTokenWithCredentials(
          {
            ...app,
            instance: data.instance,
            username: this.user.username,
            password: this.user.password
          }
        ).then((result) => {
          if (result.error) {
            if (result.error === 'mfa_required') {
              this.requireMFA({ settings: result })
            } else if (result.identifier === 'password_reset_required') {
              this.$router.push({ name: 'password-reset', params: { passwordResetRequested: true } })
            } else {
              this.error = result.error
              this.focusOnPasswordInput()
            }
            return
          }
          this.login(result).then(() => {
            this.$router.push({ name: 'friends' })
          })
        })
      })
    },
    clearError () { this.error = false },
    focusOnPasswordInput () {
      let passwordInput = this.$refs.passwordInput
      passwordInput.focus()
      passwordInput.setSelectionRange(0, passwordInput.value.length)
    }
  }
}

export default LoginForm
