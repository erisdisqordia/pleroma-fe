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
    }
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
      this.$router.push('/main/all')
    }
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
    ...mapActions(['signUp']),
    async submit () {
      this.user.nickname = this.user.username
      this.user.token = this.token

      this.$v.$touch()

      if (!this.$v.$invalid) {
        try {
          await this.signUp(this.user)
          this.$router.push('/main/friends')
        } catch (error) {
          console.log('Registration failed: ' + error)
        }
      }
    }
  }
}

export default registration
