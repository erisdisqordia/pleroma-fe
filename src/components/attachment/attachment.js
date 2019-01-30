import StillImage from '../still-image/still-image.vue'
import VideoAttachment from '../video_attachment/video_attachment.vue'
import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId',
    'size',
    'allowPlay',
    'setMedia'
  ],
  data () {
    return {
      nsfwImage: this.$store.state.instance.nsfwCensorImage || nsfwImage,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      preloadImage: this.$store.state.config.preloadImage,
      loading: false,
      img: fileTypeService.fileType(this.attachment.mimetype) === 'image' && document.createElement('img'),
      modalOpen: false,
      showHidden: false
    }
  },
  components: {
    StillImage,
    VideoAttachment
  },
  computed: {
    usePlaceHolder () {
      return this.size === 'hide' || this.type === 'unknown'
    },
    referrerpolicy () {
      return this.$store.state.instance.mediaProxyAvailable ? '' : 'no-referrer'
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
    openModal (event) {
      const modalTypes = this.$store.state.config.playVideosInline
        ? ['image']
        : ['image', 'video']
      if (fileTypeService.fileMatchesSomeType(modalTypes, this.attachment) ||
        this.usePlaceHolder
      ) {
        event.stopPropagation()
        event.preventDefault()
        this.setMedia()
        this.$store.dispatch('setCurrent', this.attachment)
      }
    },
    toggleHidden (event) {
      if (this.$store.state.config.useOneClickNsfw && !this.showHidden) {
        this.openModal(event)
        return
      }
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
    }
  }
}

export default Attachment
