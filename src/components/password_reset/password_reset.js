import { mapState } from 'vuex'
import passwordResetApi from '../../services/new_api/password_reset.js'

const passwordReset = {
  data: () => ({
    user: {
      email: ''
    },
    isPending: false,
    success: false,
    throttled: false,
    error: null
  }),
  computed: {
    ...mapState({
      signedIn: (state) => !!state.users.currentUser,
      instance: state => state.instance
    }),
    mailerEnabled () {
      return this.instance.mailerEnabled
    }
  },
  created () {
    if (this.signedIn) {
      this.$router.push({ name: 'root' })
    }
  },
  props: {
    passwordResetRequested: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    dismissError () {
      this.error = null
    },
    submit () {
      this.isPending = true
      const email = this.user.email
      const instance = this.instance.server

      passwordResetApi({ instance, email }).then(({ status }) => {
        this.isPending = false
        this.user.email = ''

        if (status === 204) {
          this.success = true
          this.error = null
        } else if (status === 429) {
          this.throttled = true
          this.error = this.$t('password_reset.too_many_requests')
        }
      }).catch(() => {
        this.isPending = false
        this.user.email = ''
        this.error = this.$t('general.generic_error')
      })
    }
  }
}

export default passwordReset
