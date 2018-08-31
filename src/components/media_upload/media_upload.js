/* eslint-env browser */
import statusPosterService from '../../services/status_poster/status_poster.service.js'

const mediaUpload = {
  mounted () {
    const input = this.$el.querySelector('input')

    input.addEventListener('change', ({target}) => {
      for (var i = 0; i < target.files.length; i++) {
        let file = target.files[i]
        this.uploadFile(file)
      }
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
        }, (error) => { // eslint-disable-line handle-callback-err
          self.$emit('upload-failed')
          self.uploading = false
        })
    },
    fileDrop (e) {
      if (e.dataTransfer.files.length > 0) {
        e.preventDefault()  // allow dropping text like before
        this.uploadFile(e.dataTransfer.files[0])
      }
    },
    fileDrag (e) {
      let types = e.dataTransfer.types
      if (types.contains('Files')) {
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
      if (!this.uploading) {
        this.uploadFile(fileInfos[0])
      }
    }
  }
}

export default mediaUpload
