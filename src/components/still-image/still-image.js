const StillImage = {
  props: [
    'src',
    'referrerpolicy',
    'mimetype'
  ],
  data () {
    return {
      stopGifs: this.$store.state.config.stopGifs
    }
  },
  computed: {
    animated () {
      return this.stopGifs && (this.mimetype === 'image/gif' || this.src.endsWith('.gif'))
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
