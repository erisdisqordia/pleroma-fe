import Confirm from './confirm.vue'
import { mapState } from 'vuex'

export default {
  props: ['settings'],
  data: () => ({
    error: false,
    currentPassword: '',
    deactivate: false,
    inProgress: false // progress peform request to disable otp method
  }),
  components: {
    'confirm': Confirm
  },
  computed: {
    isActivated () {
      return this.settings.totp
    },
    ...mapState({
      backendInteractor: (state) => state.api.backendInteractor
    })
  },
  methods: {
    doActivate () {
      this.$emit('activate')
    },
    cancelDeactivate () { this.deactivate = false },
    doDeactivate () {
      this.error = null
      this.deactivate = true
    },
    confirmDeactivate () { // confirm deactivate TOTP method
      this.error = null
      this.inProgress = true
      this.backendInteractor.mfaDisableOTP({
        password: this.currentPassword
      })
        .then((res) => {
          this.inProgress = false
          if (res.error) {
            this.error = res.error
            return
          }
          this.deactivate = false
          this.$emit('deactivate')
        })
    }
  }
}
