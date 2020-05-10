import ProgressButton from 'src/components/progress_button/progress_button.vue'
import Checkbox from 'src/components/checkbox/checkbox.vue'
import Mfa from './mfa.vue'

const SecurityTab = {
  data () {
    return {
      newEmail: '',
      changeEmailError: false,
      changeEmailPassword: '',
      changedEmail: false,
      deletingAccount: false,
      deleteAccountConfirmPasswordInput: '',
      deleteAccountError: false,
      changePasswordInputs: [ '', '', '' ],
      changedPassword: false,
      changePasswordError: false
    }
  },
  created () {
    this.$store.dispatch('fetchTokens')
  },
  components: {
    ProgressButton,
    Mfa,
    Checkbox
  },
  computed: {
    user () {
      return this.$store.state.users.currentUser
    },
    pleromaBackend () {
      return this.$store.state.instance.pleromaBackend
    },
    oauthTokens () {
      return this.$store.state.oauthTokens.tokens.map(oauthToken => {
        return {
          id: oauthToken.id,
          appName: oauthToken.app_name,
          validUntil: new Date(oauthToken.valid_until).toLocaleDateString()
        }
      })
    }
  },
  methods: {
    confirmDelete () {
      this.deletingAccount = true
    },
    deleteAccount () {
      this.$store.state.api.backendInteractor.deleteAccount({ password: this.deleteAccountConfirmPasswordInput })
        .then((res) => {
          if (res.status === 'success') {
            this.$store.dispatch('logout')
            this.$router.push({ name: 'root' })
          } else {
            this.deleteAccountError = res.error
          }
        })
    },
    changePassword () {
      const params = {
        password: this.changePasswordInputs[0],
        newPassword: this.changePasswordInputs[1],
        newPasswordConfirmation: this.changePasswordInputs[2]
      }
      this.$store.state.api.backendInteractor.changePassword(params)
        .then((res) => {
          if (res.status === 'success') {
            this.changedPassword = true
            this.changePasswordError = false
            this.logout()
          } else {
            this.changedPassword = false
            this.changePasswordError = res.error
          }
        })
    },
    changeEmail () {
      const params = {
        email: this.newEmail,
        password: this.changeEmailPassword
      }
      this.$store.state.api.backendInteractor.changeEmail(params)
        .then((res) => {
          if (res.status === 'success') {
            this.changedEmail = true
            this.changeEmailError = false
          } else {
            this.changedEmail = false
            this.changeEmailError = res.error
          }
        })
    },
    logout () {
      this.$store.dispatch('logout')
      this.$router.replace('/')
    },
    revokeToken (id) {
      if (window.confirm(`${this.$i18n.t('settings.revoke_token')}?`)) {
        this.$store.dispatch('revokeToken', id)
      }
    }
  }
}

export default SecurityTab
