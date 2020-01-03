import RecoveryCodes from './mfa_backup_codes.vue'
import TOTP from './mfa_totp.vue'
import Confirm from './confirm.vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { mapState } from 'vuex'

const Mfa = {
  data: () => ({
    settings: { // current settings of MFA
      available: false,
      enabled: false,
      totp: false
    },
    setupState: { // setup mfa
      state: '', // state of setup. '' -> 'getBackupCodes' -> 'setupOTP' -> 'complete'
      setupOTPState: '' // state of setup otp. '' -> 'prepare' -> 'confirm' -> 'complete'
    },
    backupCodes: {
      getNewCodes: false,
      inProgress: false, //  progress of fetch codes
      codes: []
    },
    otpSettings: { // pre-setup setting of OTP. secret key, qrcode url.
      provisioning_uri: '',
      key: ''
    },
    currentPassword: null,
    otpConfirmToken: null,
    error: null,
    readyInit: false
  }),
  components: {
    'recovery-codes': RecoveryCodes,
    'totp-item': TOTP,
    'qrcode': VueQrcode,
    'confirm': Confirm
  },
  computed: {
    canSetupOTP () {
      return (
        (this.setupInProgress && this.backupCodesPrepared) ||
          this.settings.enabled
      ) && !this.settings.totp && !this.setupOTPInProgress
    },
    setupInProgress () {
      return this.setupState.state !== '' && this.setupState.state !== 'complete'
    },
    setupOTPInProgress () {
      return this.setupState.state === 'setupOTP' && !this.completedOTP
    },
    prepareOTP () {
      return this.setupState.setupOTPState === 'prepare'
    },
    confirmOTP () {
      return this.setupState.setupOTPState === 'confirm'
    },
    completedOTP () {
      return this.setupState.setupOTPState === 'completed'
    },
    backupCodesPrepared () {
      return !this.backupCodes.inProgress && this.backupCodes.codes.length > 0
    },
    confirmNewBackupCodes () {
      return this.backupCodes.getNewCodes
    },
    ...mapState({
      backendInteractor: (state) => state.api.backendInteractor
    })
  },

  methods: {
    activateOTP () {
      if (!this.settings.enabled) {
        this.setupState.state = 'getBackupcodes'
        this.fetchBackupCodes()
      }
    },
    fetchBackupCodes () {
      this.backupCodes.inProgress = true
      this.backupCodes.codes = []

      return this.backendInteractor.generateMfaBackupCodes()
        .then((res) => {
          this.backupCodes.codes = res.codes
          this.backupCodes.inProgress = false
        })
    },
    getBackupCodes () { // get a new backup codes
      this.backupCodes.getNewCodes = true
    },
    confirmBackupCodes () { // confirm getting new backup codes
      this.fetchBackupCodes().then((res) => {
        this.backupCodes.getNewCodes = false
      })
    },
    cancelBackupCodes () { // cancel confirm form of new backup codes
      this.backupCodes.getNewCodes = false
    },

    // Setup OTP
    setupOTP () { // prepare setup OTP
      this.setupState.state = 'setupOTP'
      this.setupState.setupOTPState = 'prepare'
      this.backendInteractor.mfaSetupOTP()
        .then((res) => {
          this.otpSettings = res
          this.setupState.setupOTPState = 'confirm'
        })
    },
    doConfirmOTP () { // handler confirm enable OTP
      this.error = null
      this.backendInteractor.mfaConfirmOTP({
        token: this.otpConfirmToken,
        password: this.currentPassword
      })
        .then((res) => {
          if (res.error) {
            this.error = res.error
            return
          }
          this.completeSetup()
        })
    },

    completeSetup () {
      this.setupState.setupOTPState = 'complete'
      this.setupState.state = 'complete'
      this.currentPassword = null
      this.error = null
      this.fetchSettings()
    },
    cancelSetup () { // cancel setup
      this.setupState.setupOTPState = ''
      this.setupState.state = ''
      this.currentPassword = null
      this.error = null
    },
    // end Setup OTP

    // fetch settings from server
    async fetchSettings () {
      let result = await this.backendInteractor.settingsMFA()
      if (result.error) return
      this.settings = result.settings
      this.settings.available = true
      return result
    }
  },
  mounted () {
    this.fetchSettings().then(() => {
      this.readyInit = true
    })
  }
}
export default Mfa
