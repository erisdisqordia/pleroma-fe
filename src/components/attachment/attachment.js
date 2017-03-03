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
      showHidden: false
    }
  },
  computed: {
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && this.hideNsfwLocal && !this.showHidden
    }
  },
  methods: {
    linkClicked ({target}) {
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    toggleHidden () {
      let img = document.createElement('img')
      img.src = this.attachment.url
      img.onload = () => {
        this.showHidden = !this.showHidden
      }
    }
  }
}

export default Attachment
