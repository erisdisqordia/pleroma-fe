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
      loading: false,
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
    referrerpolicy () {
      return this.$store.state.instance.mediaProxyAvailable ? '' : 'no-referrer'
    },
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && this.hideNsfwLocal
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
    toggleModal (event) {
      if (this.type !== 'image' && this.type !== 'video') {
        return
      }
      event.stopPropagation()
      event.preventDefault()
      this.setMedia()
      this.$store.dispatch('setCurrent', this.attachment)
    }
  }
}

export default Attachment
