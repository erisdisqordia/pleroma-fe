import nsfwImage from '../../assets/nsfw.jpg'

const Attachment = {
  props: [
    'attachment',
    'nsfw'
  ],
  data: () => ({ nsfwImage }),
  computed: {
    type () {
      return 'image'
    }
  },
  methods: {
    showNsfw () {
      this.nsfw = false
    }
  }
}

export default Attachment
