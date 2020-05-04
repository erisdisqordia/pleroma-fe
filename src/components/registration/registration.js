import { validationMixin } from 'vuelidate'
import { required, requiredIf, sameAs } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'

const registration = {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      fullname: '',
      username: '',
      password: '',
      confirm: ''
    },
    captcha: {}
  }),
  validations () {
    return {
      user: {
        email: { required: requiredIf(() => this.accountActivationRequired) },
        username: { required },
        fullname: { required },
        password: { required },
        confirm: {
          required,
          sameAsPassword: sameAs('password')
        }
      }
    }
  },
  created () {
    if ((!this.registrationOpen && !this.token) || this.signedIn) {
      this.$router.push({ name: 'root' })
    }

    this.setCaptcha()
  },
  computed: {
    token () { return this.$route.params.token },
    bioPlaceholder () {
      return this.$t('registration.bio_placeholder').replace(/\s*\n\s*/g, ' \n')
    },
    ...mapState({
      registrationOpen: (state) => state.instance.registrationOpen,
      signedIn: (state) => !!state.users.currentUser,
      isPending: (state) => state.users.signUpPending,
      serverValidationErrors: (state) => state.users.signUpErrors,
      termsOfService: (state) => state.instance.tos,
      accountActivationRequired: (state) => state.instance.accountActivationRequired
    })
  },
  methods: {
    ...mapActions(['signUp', 'getCaptcha']),
    async submit () {
      this.user.nickname = this.user.username
      this.user.token = this.token

      this.user.captcha_solution = this.captcha.solution
      this.user.captcha_token = this.captcha.token
      this.user.captcha_answer_data = this.captcha.answer_data

      this.$v.$touch()

      if (!this.$v.$invalid) {
        try {
          await this.signUp(this.user)
          this.$router.push({ name: 'friends' })
        } catch (error) {
          console.warn('Registration failed: ', error)
          this.setCaptcha()
        }
      }
    },
    setCaptcha () {
      this.getCaptcha().then(cpt => { this.captcha = cpt })
    }
  }
}

export default registration
