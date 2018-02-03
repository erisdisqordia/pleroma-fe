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
    animated: {
      get () {
        // If mimetype is gif then it is certainly animated, if it's undefined - we don't know YET
        return this.mimetype === 'image/gif' ? true : this.mimetype == null ? 'maybe' : false
      },
      set (val) {
        this.mimetype = val
      }
    }
  },
  methods: {
    onLoad () {
      const canvas = this.$refs.canvas
      if (!canvas) return
      canvas.getContext('2d').drawImage(this.$refs.src, 1, 1, canvas.width, canvas.height)
      if (this.animated === 'maybe') {
        fetch(this.src).then((data) => {
          console.log(data)
          this.animated = data.type
        })
      }
    }
  }
}

export default StillImage
