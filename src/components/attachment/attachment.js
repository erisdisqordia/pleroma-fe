import StillImage from '../still-image/still-image.vue'
import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId',
    'size'
  ],
  data () {
    return {
      nsfwImage,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      loopVideo: this.$store.state.config.loopVideo,
      showHidden: false,
      loading: false,
      img: this.type === 'image' && document.createElement('img')
    }
  },
  components: {
    StillImage
  },
  computed: {
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && this.hideNsfwLocal && !this.showHidden
    },
    isEmpty () {
      return (this.type === 'html' && !this.attachment.oembed) || this.type === 'unknown'
    },
    isSmall () {
      return this.size === 'small'
    },
    fullwidth () {
      return fileTypeService.fileType(this.attachment.mimetype) === 'html'
    }
  },
  methods: {
    linkClicked ({target}) {
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    toggleHidden () {
      if (this.img) {
        if (this.img.onload) {
          this.img.onload()
        } else {
          this.loading = true
          this.img.src = this.attachment.url
          this.img.onload = () => {
            this.loading = false
            this.showHidden = !this.showHidden
          }
        }
      } else {
        this.showHidden = !this.showHidden
      }
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

export default Attachment
