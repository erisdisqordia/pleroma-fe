/* eslint-env browser */
import statusPosterService from '../../services/status_poster/status_poster.service.js'

const mediaUpload = {
  mounted () {
    const input = this.$el.querySelector('input')

    input.addEventListener('change', ({target}) => {
      const file = target.files[0]
      this.uploadFile(file)
    })
  },
  data () {
    return {
      uploading: false
    }
  },
  methods: {
    uploadFile (file) {
      const self = this
      const store = this.$store
      const formData = new FormData()
      formData.append('media', file)

      self.$emit('uploading')
      self.uploading = true

      statusPosterService.uploadMedia({ store, formData })
        .then((fileData) => {
          self.$emit('uploaded', fileData)
          self.uploading = false
        }, (error) => {
          self.$emit('upload-failed')
          self.uploading = false
        })
    }
  },
  props: [
    'dropFiles'
  ],
  watch: {
    'dropFiles': function (fileInfos) {
      if (!this.uploading) {
        this.uploadFile(fileInfos[0])
      }
    }
  }
}

export default mediaUpload
