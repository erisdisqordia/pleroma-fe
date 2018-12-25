import { validationMixin } from 'vuelidate'
import { required, sameAs } from 'vuelidate/lib/validators'
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
  validations: {
    user: {
      email: { required },
      username: { required },
      fullname: { required },
      password: { required },
      confirm: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  created () {
    if ((!this.registrationOpen && !this.token) || this.signedIn) {
      this.$router.push({name: 'root'})
    }

    this.setCaptcha()
  },
  computed: {
    token () { return this.$route.params.token },
    ...mapState({
      registrationOpen: (state) => state.instance.registrationOpen,
      signedIn: (state) => !!state.users.currentUser,
      isPending: (state) => state.users.signUpPending,
      serverValidationErrors: (state) => state.users.signUpErrors,
      termsOfService: (state) => state.instance.tos
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
          this.$router.push({name: 'friends'})
        } catch (error) {
          console.warn('Registration failed: ' + error)
        }
      }
    },
    setCaptcha () {
      this.getCaptcha().then(cpt => { this.captcha = cpt })
    }
  }
}

export default registration
