/* eslint-env browser */
import statusPosterService from '../../services/status_poster/status_poster.service.js'

const mediaUpload = {
  mounted () {
    const store = this.$store
    const input = this.$el.querySelector('input')
    const self = this

    input.addEventListener('change', ({target}) => {
      const file = target.files[0]
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
    })
  },
  data () {
    return {
      uploading: false
    }
  }
}

export default mediaUpload
