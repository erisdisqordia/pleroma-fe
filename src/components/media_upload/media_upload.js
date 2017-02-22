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
    uploadFile(file) {
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
    },
    fileDrop (e) {
      if(e.dataTransfer.files.length > 0) {
        e.preventDefault()  // allow dropping text like before
        this.uploadFile(e.dataTransfer.files[0])
      }
    },
    fileDrag (e) {
      let types = e.dataTransfer.types
      if(types.contains('Files')) {
        e.dataTransfer.dropEffect = 'copy'
      } else {
        e.dataTransfer.dropEffect = 'none'
      }
    }
  },
  props: [
    'dropFiles'
  ],
  watch: {
    'dropFiles': function (fileInfos) {
      if (!this.uploading)
        this.uploadFile(fileInfos[0])
    }
  }
}

export default mediaUpload
