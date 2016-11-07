import nsfwImage from '../../assets/nsfw.jpg'

const Attachment = {
  props: [
    'attachment',
    'nsfw',
    'statusId'
  ],
  data: () => ({ nsfwImage }),
  computed: {
    type () {
      let type = 'unknown'

      if (this.attachment.mimetype.match(/text\/html/)) {
        type = 'html'
      }

      if (this.attachment.mimetype.match(/image/)) {
        type = 'image'
      }

      if (this.attachment.mimetype.match(/video\/(webm|mp4)/)) {
        type = 'video'
      };

      return type
    }
  },
  methods: {
    showNsfw () {
      this.$store.commit('setNsfw', { id: this.statusId, nsfw: false })
    }
  }
}

export default Attachment
