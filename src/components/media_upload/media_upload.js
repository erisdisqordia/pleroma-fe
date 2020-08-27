/* eslint-env browser */
import statusPosterService from '../../services/status_poster/status_poster.service.js'
import fileSizeFormatService from '../../services/file_size_format/file_size_format.js'

const mediaUpload = {
  data () {
    return {
      uploadCount: 0,
      uploadReady: true
    }
  },
  computed: {
    uploading () {
      return this.uploadCount > 0
    }
  },
  methods: {
    uploadFile (file) {
      const self = this
      const store = this.$store
      if (file.size > store.state.instance.uploadlimit) {
        const filesize = fileSizeFormatService.fileSizeFormat(file.size)
        const allowedsize = fileSizeFormatService.fileSizeFormat(store.state.instance.uploadlimit)
        self.$emit('upload-failed', 'file_too_big', { filesize: filesize.num, filesizeunit: filesize.unit, allowedsize: allowedsize.num, allowedsizeunit: allowedsize.unit })
        return
      }
      const formData = new FormData()
      formData.append('file', file)

      self.$emit('uploading')
      self.uploadCount++

      statusPosterService.uploadMedia({ store, formData })
        .then((fileData) => {
          self.$emit('uploaded', fileData)
          self.decreaseUploadCount()
        }, (error) => { // eslint-disable-line handle-callback-err
          self.$emit('upload-failed', 'default')
          self.decreaseUploadCount()
        })
    },
    decreaseUploadCount () {
      this.uploadCount--
      if (this.uploadCount === 0) {
        this.$emit('all-uploaded')
      }
    },
    clearFile () {
      this.uploadReady = false
      this.$nextTick(() => {
        this.uploadReady = true
      })
    },
    multiUpload (files) {
      for (const file of files) {
        this.uploadFile(file)
      }
    },
    change ({ target }) {
      this.multiUpload(target.files)
    }
  },
  props: [
    'dropFiles',
    'disabled'
  ],
  watch: {
    'dropFiles': function (fileInfos) {
      if (!this.uploading) {
        this.multiUpload(fileInfos)
      }
    }
  }
}

export default mediaUpload
