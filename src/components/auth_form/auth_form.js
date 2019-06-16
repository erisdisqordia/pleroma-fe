import LoginForm from '../login_form/login_form.vue'
import MFARecoveryForm from '../mfa_form/recovery_form.vue'
import MFATOTPForm from '../mfa_form/totp_form.vue'
import { mapGetters } from 'vuex'

const AuthForm = {
  name: 'AuthForm',
  render (createElement) {
    return createElement('component', { is: this.authForm })
  },
  computed: {
    authForm () {
      if (this.requiredTOTP) { return 'MFATOTPForm' }
      if (this.requiredRecovery) { return 'MFARecoveryForm' }
      return 'LoginForm'
    },
    ...mapGetters('authFlow', ['requiredTOTP', 'requiredRecovery'])
  },
  components: {
    MFARecoveryForm,
    MFATOTPForm,
    LoginForm
  }
}

export default AuthForm
