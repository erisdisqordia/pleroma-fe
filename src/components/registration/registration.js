import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapActions, mapState } from 'vuex'
import { SIGN_UP } from '../../mutation_types'

const registration = {
  mixins: [validationMixin],
  data: () => ({
    user: {
      email: '',
      username: '',
      password: '',
      confirm: ''
    },
    clientValidationFailed: false
  }),
  validations: {
    user: {
      email: { required },
      username: { required },
      password: { required },
      confirm: { required }
    }
  },
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
    token () { return this.$route.params.token },
    ...mapState({
      isPending: (state) => state.users[SIGN_UP.isPending],
      serverValidationErrors: (state) => state.users[SIGN_UP.errors],
      termsofservice: (state) => state.instance.tos
    })
  },
  methods: {
    ...mapActions(['signUp']),
    submit () {
      this.user.nickname = this.user.username
      this.user.token = this.token

      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.signUp(this.user)
      }
    }
  }
}

export default registration
