import StillImage from '../still-image/still-image.vue'
import fileTypeService from '../../services/file_type/file_type.service.js'

const MediaModal = {
  data () {
    return {
      loopVideo: this.$store.state.config.loopVideo
    }
  },
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
    }
  },
  methods: {
    hide () {
      this.$store.dispatch('closeMediaViewer')
    },
    onVideoDataLoad (e) {
      if (typeof e.srcElement.webkitAudioDecodedByteCount !== 'undefined') {
        // non-zero if video has audio track
        if (e.srcElement.webkitAudioDecodedByteCount > 0) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      } else if (typeof e.srcElement.mozHasAudio !== 'undefined') {
        // true if video has audio track
        if (e.srcElement.mozHasAudio) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      } else if (typeof e.srcElement.audioTracks !== 'undefined') {
        if (e.srcElement.audioTracks.length > 0) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      }
    }
  }
}

export default MediaModal
