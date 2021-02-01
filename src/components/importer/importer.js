import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircleNotch,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCircleNotch,
  faTimes
)

const Importer = {
  props: {
    submitHandler: {
      type: Function,
      required: true
    },
    submitButtonLabel: {
      type: String,
      default () {
        return this.$t('importer.submit')
      }
    },
    successMessage: {
      type: String,
      default () {
        return this.$t('importer.success')
      }
    },
    errorMessage: {
      type: String,
      default () {
        return this.$t('importer.error')
      }
    }
  },
  data () {
    return {
      file: null,
      error: false,
      success: false,
      submitting: false
    }
  },
  methods: {
    change () {
      this.file = this.$refs.input.files[0]
    },
    submit () {
      this.dismiss()
      this.submitting = true
      this.submitHandler(this.file)
        .then(() => { this.success = true })
        .catch(() => { this.error = true })
        .finally(() => { this.submitting = false })
    },
    dismiss () {
      this.success = false
      this.error = false
    }
  }
}

export default Importer
