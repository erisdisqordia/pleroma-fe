import StillImage from '../still-image/still-image.vue'
import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId',
    'size',
    'setMedia'
  ],
  data () {
    return {
      nsfwImage: this.$store.state.config.nsfwCensorImage || nsfwImage,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      preloadImage: this.$store.state.config.preloadImage,
      loopVideo: this.$store.state.config.loopVideo,
      showHidden: false,
      loading: false,
      img: fileTypeService.fileType(this.attachment.mimetype) === 'image' && document.createElement('img'),
      modalOpen: false
    }
  },
  components: {
    StillImage
  },
  computed: {
    usePlaceHolder () {
      return this.size === 'hide' || this.type === 'unknown'
    },
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
      return this.type === 'html' || this.type === 'audio'
    }
  },
  methods: {
    linkClicked ({target}) {
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    toggleHidden () {
      if (this.img && !this.preloadImage) {
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
    toggleModal (event) {
      if (this.type !== 'image' && this.type !== 'video') {
        return
      }
      event.preventDefault()
      this.setMedia()
      this.$store.dispatch('setCurrent', this.attachment)
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
