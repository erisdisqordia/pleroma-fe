import nsfwImage from '../../assets/nsfw.jpg'
import fileTypeService from '../../services/file_type/file_type.service.js'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId'
  ],
  data: () => ({ nsfwImage }),
  computed: {
    type () {
      return fileTypeService.fileType(this.attachment.mimetype)
    }
  },
  methods: {
    showNsfw () {
      this.$store.commit('setNsfw', { id: this.statusId, nsfw: false })
    }
  }
}

export default Attachment
