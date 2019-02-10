import StillImage from '../still-image/still-image.vue'
import VideoAttachment from '../video_attachment/video_attachment.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'

const MediaModal = {
  components: {
    StillImage,
    VideoAttachment
  },
  computed: {
    showing () {
      return this.$store.state.mediaViewer.activated
    },
    media () {
      return this.$store.state.mediaViewer.media
    },
    currentIndex () {
      return this.$store.state.mediaViewer.currentIndex
    },
    currentMedia () {
      return this.media[this.currentIndex]
    },
    canNavigate () {
      return this.media.length > 1
    },
    type () {
      return this.currentMedia ? fileTypeService.fileType(this.currentMedia.mimetype) : null
    }
  },
  methods: {
    hide () {
      this.$store.dispatch('closeMediaViewer')
    },
    goPrev () {
      if (this.canNavigate) {
        const prevIndex = this.currentIndex === 0 ? this.media.length - 1 : (this.currentIndex - 1)
        this.$store.dispatch('setCurrent', this.media[prevIndex])
      }
    },
    goNext () {
      if (this.canNavigate) {
        const nextIndex = this.currentIndex === this.media.length - 1 ? 0 : (this.currentIndex + 1)
        this.$store.dispatch('setCurrent', this.media[nextIndex])
      }
    },
    handleKeyupEvent (e) {
      if (this.showing && e.keyCode === 27) { // escape
        this.hide()
      }
    },
    handleKeydownEvent (e) {
      if (!this.showing) {
        return
      }

      if (e.keyCode === 39) { // arrow right
        this.goNext()
      } else if (e.keyCode === 37) { // arrow left
        this.goPrev()
      }
    }
  },
  mounted () {
    document.addEventListener('keyup', this.handleKeyupEvent)
    document.addEventListener('keydown', this.handleKeydownEvent)
  },
  destroyed () {
    document.removeEventListener('keyup', this.handleKeyupEvent)
    document.removeEventListener('keydown', this.handleKeydownEvent)
  }
}

export default MediaModal
