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
    showHidden: false
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
    toggleHidden () {
      this.showHidden = !this.showHidden
    }
  }
}

export default Attachment
