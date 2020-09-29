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
      const image = this.$refs.src
      if (!image) return
      this.imageLoadHandler && this.imageLoadHandler(image)
      const canvas = this.$refs.canvas
      if (!canvas) return
      const width = image.naturalWidth
      const height = image.naturalHeight
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(image, 0, 0, width, height)
    },
    onError () {
      this.imageLoadError && this.imageLoadError()
    }
  }
}

export default StillImage
