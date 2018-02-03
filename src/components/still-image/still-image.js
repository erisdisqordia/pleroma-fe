const StillImage = {
  props: [
    'src',
    'referrerpolicy',
    'mimetype'
  ],
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
