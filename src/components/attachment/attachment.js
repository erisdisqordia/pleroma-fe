import nsfwImage from '../../assets/nsfw.png'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId'
  ],
  data: () => ({
    nsfwImage,
    hideNsfwLocal: this.$store.state.config.hideNsfw,
    showHidden: !this.hideNsfwLocal
  }),
  computed: {
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    },
    hidden () {
      return this.nsfw && !this.showHidden
    }
  },
  methods: {
    linkClicked ({target}) {
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    toggleHidden () {
      this.showHidden = !this.showHidden
    }
  }
}

export default Attachment
