import Cropper from 'cropperjs'
import Modal from '../modal/modal.vue'
import 'cropperjs/dist/cropper.css'

const ImageCropper = {
  props: {
    trigger: {
      type: [String, Element],
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
    title: {
      type: String,
      default: 'Crop picture'
    },
    saveButtonLabel: {
      type: String,
      default: 'Save'
    }
  },
  data () {
    return {
      cropper: undefined,
      dataUrl: undefined,
      filename: undefined
    }
  },
  components: {
    Modal
  },
  methods: {
    destroy () {
      this.cropper.destroy()
      this.$refs.input.value = ''
      this.dataUrl = undefined
    },
    submit () {
      this.$emit('submit', this.cropper, this.filename)
      this.destroy()
    },
    pickImage () {
      this.$refs.input.click()
    },
    createCropper () {
      this.cropper = new Cropper(this.$refs.img, this.cropperOptions)
    }
  },
  mounted () {
    // listen for click event on trigger
    let trigger = typeof this.trigger === 'object' ? this.trigger : document.querySelector(this.trigger)
    if (!trigger) {
      this.$emit('error', 'No image make trigger found.', 'user')
    } else {
      trigger.addEventListener('click', this.pickImage)
    }
    // listen for input file changes
    let fileInput = this.$refs.input
    fileInput.addEventListener('change', () => {
      if (fileInput.files != null && fileInput.files[0] != null) {
        let reader = new FileReader()
        reader.onload = (e) => {
          this.dataUrl = e.target.result
        }
        reader.readAsDataURL(fileInput.files[0])
        this.filename = fileInput.files[0].name || 'unknown'
        this.$emit('changed', fileInput.files[0], reader)
      }
    })
  }
}

export default ImageCropper
