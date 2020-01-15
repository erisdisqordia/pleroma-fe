/* eslint-env browser */
import statusPosterService from '../../services/status_poster/status_poster.service.js'
import TabSwitcher from '../tab_switcher/tab_switcher.js'

const StickerPicker = {
  components: {
    TabSwitcher
  },
  data () {
    return {
      meta: {
        stickers: []
      },
      path: ''
    }
  },
  computed: {
    pack () {
      return this.$store.state.instance.stickers || []
    }
  },
  methods: {
    clear () {
      this.meta = {
        stickers: []
      }
    },
    pick (sticker, name) {
      const store = this.$store
      // TODO remove this workaround by finding a way to bypass reuploads
      fetch(sticker)
        .then((res) => {
          res.blob().then((blob) => {
            var file = new File([blob], name, { mimetype: 'image/png' })
            var formData = new FormData()
            formData.append('file', file)
            statusPosterService.uploadMedia({ store, formData })
              .then((fileData) => {
                this.$emit('uploaded', fileData)
                this.clear()
              }, (error) => {
                console.warn("Can't attach sticker")
                console.warn(error)
                this.$emit('upload-failed', 'default')
              })
          })
        })
    }
  }
}

export default StickerPicker
