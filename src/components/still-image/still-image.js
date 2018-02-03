import fileTypeService from '../../services/file_type/file_type.service.js'

const StillImage = {
  props: [
    'src',
    'referrerpolicy',
    'mimetype'
  ],
  data () {
    return {
      hideNsfwLocal: this.$store.state.config.hideNsfw,
    }
  },
  computed: {
    animated () {
      return this.mimetype === 'image/gif' || this.src.endsWith('.gif')
    }
  },
  methods: {
    onLoad () {
      const canvas = this.$refs.canvas
      if (!canvas) return
      canvas.getContext('2d').drawImage(this.$refs.src, 1, 1, canvas.width, canvas.height)
    }
  }
}

export default StillImage
