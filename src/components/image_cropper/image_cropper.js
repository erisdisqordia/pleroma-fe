import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTimes,
  faCircleNotch
)

const ImageCropper = {
  props: {
    trigger: {
      type: [String, window.Element],
      required: true
    },
    submitHandler: {
      type: Function,
      required: true
    },
    cropperOptions: {
      type: Object,
      default () {
        return {
          aspectRatio: 1,
          autoCropArea: 1,
          viewMode: 1,
          movable: false,
          zoomable: false,
          guides: false
        }
      }
    },
    mimes: {
      type: String,
      default: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    },
    saveButtonLabel: {
      type: String
    },
    saveWithoutCroppingButtonlabel: {
      type: String
    },
    cancelButtonLabel: {
      type: String
    }
  },
  data () {
    return {
      cropper: undefined,
      dataUrl: undefined,
      filename: undefined,
      submitting: false,
      submitError: null
    }
  },
  computed: {
    saveText () {
      return this.saveButtonLabel || this.$t('image_cropper.save')
    },
    saveWithoutCroppingText () {
      return this.saveWithoutCroppingButtonlabel || this.$t('image_cropper.save_without_cropping')
    },
    cancelText () {
      return this.cancelButtonLabel || this.$t('image_cropper.cancel')
    },
    submitErrorMsg () {
      return this.submitError && this.submitError instanceof Error ? this.submitError.toString() : this.submitError
    }
  },
  methods: {
    destroy () {
      if (this.cropper) {
        this.cropper.destroy()
      }
      this.$refs.input.value = ''
      this.dataUrl = undefined
      this.$emit('close')
    },
    submit (cropping = true) {
      this.submitting = true
      this.avatarUploadError = null
      this.submitHandler(cropping && this.cropper, this.file)
        .then(() => this.destroy())
        .catch((err) => {
          this.submitError = err
        })
        .finally(() => {
          this.submitting = false
        })
    },
    pickImage () {
      this.$refs.input.click()
    },
    createCropper () {
      this.cropper = new Cropper(this.$refs.img, this.cropperOptions)
    },
    getTriggerDOM () {
      return typeof this.trigger === 'object' ? this.trigger : document.querySelector(this.trigger)
    },
    readFile () {
      const fileInput = this.$refs.input
      if (fileInput.files != null && fileInput.files[0] != null) {
        this.file = fileInput.files[0]
        let reader = new window.FileReader()
        reader.onload = (e) => {
          this.dataUrl = e.target.result
          this.$emit('open')
        }
        reader.readAsDataURL(this.file)
        this.$emit('changed', this.file, reader)
      }
    },
    clearError () {
      this.submitError = null
    }
  },
  mounted () {
    // listen for click event on trigger
    const trigger = this.getTriggerDOM()
    if (!trigger) {
      this.$emit('error', 'No image make trigger found.', 'user')
    } else {
      trigger.addEventListener('click', this.pickImage)
    }
    // listen for input file changes
    const fileInput = this.$refs.input
    fileInput.addEventListener('change', this.readFile)
  },
  beforeDestroy: function () {
    // remove the event listeners
    const trigger = this.getTriggerDOM()
    if (trigger) {
      trigger.removeEventListener('click', this.pickImage)
    }
    const fileInput = this.$refs.input
    fileInput.removeEventListener('change', this.readFile)
  }
}

export default ImageCropper
