import StillImage from '../still-image/still-image.vue'
import VideoAttachment from '../video_attachment/video_attachment.vue'
import Modal from '../modal/modal.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'
import GestureService from '../../services/gesture_service/gesture_service'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChevronLeft,
  faChevronRight
)

const MediaModal = {
  components: {
    StillImage,
    VideoAttachment,
    Modal
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
  created () {
    this.mediaSwipeGestureRight = GestureService.swipeGesture(
      GestureService.DIRECTION_RIGHT,
      this.goPrev,
      50
    )
    this.mediaSwipeGestureLeft = GestureService.swipeGesture(
      GestureService.DIRECTION_LEFT,
      this.goNext,
      50
    )
  },
  methods: {
    mediaTouchStart (e) {
      GestureService.beginSwipe(e, this.mediaSwipeGestureRight)
      GestureService.beginSwipe(e, this.mediaSwipeGestureLeft)
    },
    mediaTouchMove (e) {
      GestureService.updateSwipe(e, this.mediaSwipeGestureRight)
      GestureService.updateSwipe(e, this.mediaSwipeGestureLeft)
    },
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
    window.addEventListener('popstate', this.hide)
    document.addEventListener('keyup', this.handleKeyupEvent)
    document.addEventListener('keydown', this.handleKeydownEvent)
  },
  destroyed () {
    window.removeEventListener('popstate', this.hide)
    document.removeEventListener('keyup', this.handleKeyupEvent)
    document.removeEventListener('keydown', this.handleKeydownEvent)
  }
}

export default MediaModal
