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
      nsfwImage: this.$store.state.config.nsfwCensorImage || nsfwImage,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      showHidden: false,
      loading: false,
      img: document.createElement('img')
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
    }
  }
}

export default Attachment
