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
      return this.mimetype === 'image/gif'
    }
  },
  methods: {
    drawCanvas() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.drawImage(this.$refs.src, 1, 1, canvas.width, canvas.height)
    }
  }
}

export default StillImage
