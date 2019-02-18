const StillImage = {
  props: [
    'src',
    'referrerpolicy',
    'mimetype',
    'imageLoadError',
    'imageLoadHandler',
    'alt'
  ],
  data () {
    return {
      stopGifs: this.$store.getters.mergedConfig.stopGifs
    }
  },
  computed: {
    animated () {
      return this.stopGifs && (this.mimetype === 'image/gif' || this.src.endsWith('.gif'))
    }
  },
  methods: {
    onLoad () {
      this.imageLoadHandler && this.imageLoadHandler(this.$refs.src)
      const canvas = this.$refs.canvas
      if (!canvas) return
      const width = this.$refs.src.naturalWidth
      const height = this.$refs.src.naturalHeight
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(this.$refs.src, 0, 0, width, height)
    },
    onError () {
      this.imageLoadError && this.imageLoadError()
    }
  }
}

export default StillImage
