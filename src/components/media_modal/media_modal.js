import StillImage from '../still-image/still-image.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'

const MediaModal = {
  components: {
    StillImage
  },
  computed: {
    showing () {
      return this.$store.state.mediaViewer.activated
    },
    currentIndex () {
      return this.$store.state.mediaViewer.currentIndex
    },
    currentMedia () {
      return this.$store.state.mediaViewer.media[this.currentIndex]
    },
    type () {
      return this.currentMedia ? fileTypeService.fileType(this.currentMedia.mimetype) : null
    },
    loopVideo () {
      return this.$store.state.config.loopVideo
    }
  },
  created () {
    document.addEventListener('keyup', e => {
      if (e.keyCode === 27 && this.showing) { // escape
        this.hide()
      }
    })
  },
  methods: {
    hide () {
      this.$store.dispatch('closeMediaViewer')
    }
  }
}

export default MediaModal
