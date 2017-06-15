import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId'
  ],
  data () {
    return {
      nsfwImage,
      hideNsfwLocal: this.$store.state.config.hideNsfw,
      showHidden: false,
      loading: false,
      img: document.createElement('img')
    }
  },
  computed: {
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && this.hideNsfwLocal && !this.showHidden
    },
    autoHeight () {
      if (this.type === 'image' && this.nsfw) {
        return {
          'min-height': '109px'
        }
      }
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
